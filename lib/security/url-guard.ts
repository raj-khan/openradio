import "server-only";

import { lookup as dnsLookup, type LookupAddress } from "node:dns";
import { isIP, type LookupFunction } from "node:net";
import { Agent, fetch as undiciFetch } from "undici";
import { isPublicIp } from "@/lib/security/ip";

export class UnsafeUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsafeUrlError";
  }
}

const BLOCKED_HOSTNAMES = /(^|\.)(localhost|local|internal|localdomain|home\.arpa)$/i;

/** Syntactic checks that do not need DNS. Returns the parsed URL. */
export function parseExternalUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new UnsafeUrlError("Invalid URL");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new UnsafeUrlError("Only http and https are allowed");
  }
  if (url.username || url.password) throw new UnsafeUrlError("Credentials are not allowed");

  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (!host || BLOCKED_HOSTNAMES.test(host)) throw new UnsafeUrlError("Host is not allowed");
  if (isIP(host) && !isPublicIp(host)) throw new UnsafeUrlError("Address is not public");
  if (!isIP(host) && !host.includes(".")) throw new UnsafeUrlError("Host is not allowed");
  return url;
}

type Resolver = (
  hostname: string,
  options: { all: true },
  callback: (err: NodeJS.ErrnoException | null, addresses: LookupAddress[]) => void,
) => void;

/**
 * DNS lookup for outgoing connections that refuses non-public addresses.
 * Used at connect time, so it also covers redirects and DNS rebinding.
 */
export function createSafeLookup(
  resolve: Resolver = dnsLookup as unknown as Resolver,
): LookupFunction {
  return (hostname, options, callback) => {
    resolve(hostname, { all: true }, (err, addresses) => {
      if (err) return callback(err, "", 0);
      const list = addresses ?? [];
      if (list.length === 0 || list.some((a) => !isPublicIp(a.address))) {
        return callback(new UnsafeUrlError(`Refusing non-public address for ${hostname}`), "", 0);
      }
      const family = typeof options === "object" && options ? options.family : undefined;
      const preferred = list.find((a) => !family || a.family === family) ?? list[0];
      if (typeof options === "object" && options?.all) {
        (callback as unknown as (e: null, a: LookupAddress[]) => void)(null, list);
      } else {
        callback(null, preferred.address, preferred.family);
      }
    });
  };
}

let agent: Agent | undefined;

function safeAgent() {
  agent ??= new Agent({
    connect: { lookup: createSafeLookup(), timeout: 5000 },
    headersTimeout: 5000,
    bodyTimeout: 5000,
  });
  return agent;
}

const MAX_REDIRECTS = 3;

/**
 * Fetch an external URL with SSRF protections: http(s) only, no credentials,
 * public addresses only (checked at connect time), limited manual redirects.
 */
export async function safeFetch(
  raw: string,
  init: { headers?: Record<string, string>; signal?: AbortSignal } = {},
) {
  let url = parseExternalUrl(raw);
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const response = await undiciFetch(url, {
      headers: init.headers,
      signal: init.signal,
      redirect: "manual",
      dispatcher: safeAgent(),
    });
    const location = response.headers.get("location");
    if (response.status >= 300 && response.status < 400 && location) {
      await response.body?.cancel();
      url = parseExternalUrl(new URL(location, url).toString());
      continue;
    }
    return response;
  }
  throw new UnsafeUrlError("Too many redirects");
}
