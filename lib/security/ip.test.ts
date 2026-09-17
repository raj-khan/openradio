import { describe, expect, it } from "vitest";
import { isPublicIp } from "@/lib/security/ip";

describe("isPublicIp", () => {
  it.each([
    "8.8.8.8",
    "1.1.1.1",
    "91.98.4.78",
    "2a01:4f8:1c1d:699::1",
    "2606:4700:4700::1111",
    "::ffff:8.8.8.8",
  ])("allows public %s", (ip) => {
    expect(isPublicIp(ip)).toBe(true);
  });

  it.each([
    "127.0.0.1",
    "10.1.2.3",
    "172.16.0.1",
    "172.31.255.255",
    "192.168.1.1",
    "169.254.169.254",
    "100.64.0.1",
    "0.0.0.0",
    "224.0.0.1",
    "255.255.255.255",
    "198.18.0.1",
    "::",
    "::1",
    "fe80::1",
    "fe80::1%eth0",
    "fc00::1",
    "fd12:3456::1",
    "ff02::1",
    "::ffff:127.0.0.1",
    "::ffff:7f00:1",
    "::ffff:169.254.169.254",
    "64:ff9b::a9fe:a9fe",
    "::127.0.0.1",
    "2001:db8::1",
    "not-an-ip",
    "",
  ])("blocks non-public %s", (ip) => {
    expect(isPublicIp(ip)).toBe(false);
  });

  it("does not over-block neighbours of private ranges", () => {
    expect(isPublicIp("172.32.0.1")).toBe(true);
    expect(isPublicIp("11.0.0.1")).toBe(true);
    expect(isPublicIp("192.169.0.1")).toBe(true);
  });
});
