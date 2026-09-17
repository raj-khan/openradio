import { isIP } from "node:net";

type Range = [bigint, number]; // network address, prefix length

function ipv4ToBigInt(ip: string): bigint {
  return ip.split(".").reduce((acc, part) => (acc << 8n) + BigInt(Number(part)), 0n);
}

function ipv6ToBigInt(ip: string): bigint {
  let address = ip.toLowerCase();
  const zone = address.indexOf("%");
  if (zone !== -1) address = address.slice(0, zone);

  // Embedded IPv4 tail, e.g. ::ffff:127.0.0.1
  const v4 = address.match(/(\d+\.\d+\.\d+\.\d+)$/);
  if (v4) {
    const n = ipv4ToBigInt(v4[1]);
    address =
      address.slice(0, -v4[1].length) + `${(n >> 16n).toString(16)}:${(n & 0xffffn).toString(16)}`;
  }

  const [head, tail] = address.split("::");
  const headParts = head ? head.split(":") : [];
  const tailParts = tail !== undefined && tail !== "" ? tail.split(":") : [];
  const missing = 8 - headParts.length - tailParts.length;
  const parts =
    tail === undefined ? headParts : [...headParts, ...Array(missing).fill("0"), ...tailParts];
  return parts.reduce((acc, part) => (acc << 16n) + BigInt(parseInt(part || "0", 16)), 0n);
}

const v4 = (cidr: string): Range => {
  const [ip, prefix] = cidr.split("/");
  return [ipv4ToBigInt(ip), Number(prefix)];
};
const v6 = (cidr: string): Range => {
  const [ip, prefix] = cidr.split("/");
  return [ipv6ToBigInt(ip), Number(prefix)];
};

const BLOCKED_V4: Range[] = [
  "0.0.0.0/8",
  "10.0.0.0/8",
  "100.64.0.0/10",
  "127.0.0.0/8",
  "169.254.0.0/16",
  "172.16.0.0/12",
  "192.0.0.0/24",
  "192.0.2.0/24",
  "192.88.99.0/24",
  "192.168.0.0/16",
  "198.18.0.0/15",
  "198.51.100.0/24",
  "203.0.113.0/24",
  "224.0.0.0/4",
  "240.0.0.0/4",
].map(v4);

const BLOCKED_V6: Range[] = [
  "::/128",
  "::1/128",
  "100::/64",
  "2001::/32", // Teredo
  "2001:db8::/32",
  "2002::/16", // 6to4
  "fc00::/7",
  "fe80::/10",
  "ff00::/8",
].map(v6);

function inRange(value: bigint, [network, prefix]: Range, bits: number) {
  const shift = BigInt(bits - prefix);
  return value >> shift === network >> shift;
}

/** True only for globally routable unicast addresses. Unknown input is not public. */
export function isPublicIp(ip: string): boolean {
  const family = isIP(ip.split("%")[0]);
  if (family === 4) {
    const n = ipv4ToBigInt(ip);
    return !BLOCKED_V4.some((range) => inRange(n, range, 32));
  }
  if (family === 6) {
    const n = ipv6ToBigInt(ip);
    // IPv4-mapped (::ffff:0:0/96) and NAT64 (64:ff9b::/96): judge the embedded IPv4.
    if (n >> 32n === 0xffffn || n >> 32n === 0x64ff9b0000000000000000n) {
      const embedded = Number(n & 0xffffffffn);
      return isPublicIp(
        [embedded >>> 24, (embedded >>> 16) & 255, (embedded >>> 8) & 255, embedded & 255].join(
          ".",
        ),
      );
    }
    // IPv4-compatible (deprecated ::a.b.c.d)
    if (n >> 32n === 0n) return false;
    return !BLOCKED_V6.some((range) => inRange(n, range, 128));
  }
  return false;
}
