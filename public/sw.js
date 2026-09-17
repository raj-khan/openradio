/* OpenRadio service worker. Caches the app shell and station metadata for
 * offline browsing. It never touches audio streams or third-party requests. */
const VERSION = "v1";
const SHELL_CACHE = `ra-shell-${VERSION}`;
const PAGES_CACHE = `ra-pages-${VERSION}`;
const DATA_CACHE = `ra-data-${VERSION}`;
const CACHES = [SHELL_CACHE, PAGES_CACHE, DATA_CACHE];
const OFFLINE_URL = "/offline";
const PRECACHE = [
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];
const CACHEABLE_API = /^\/api\/(stations(\/[^/]+)?|countries|languages|tags)$/;
const NAVIGATION_TIMEOUT_MS = 4000;
const MAX_PAGES = 40;
const MAX_DATA = 150;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("ra-") && !CACHES.includes(k))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (const key of keys.slice(0, Math.max(0, keys.length - max))) await cache.delete(key);
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) (await caches.open(cacheName)).put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(event, cacheName, max) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(event.request);
  const network = fetch(event.request)
    .then(async (response) => {
      if (response.ok) {
        await cache.put(event.request, response.clone());
        await trim(cacheName, max);
      }
      return response;
    })
    .catch(() => cached);
  if (cached) {
    event.waitUntil(network);
    return cached;
  }
  return network.then((response) => response || Response.error());
}

async function networkFirstPage(event) {
  const cache = await caches.open(PAGES_CACHE);
  try {
    const response = await Promise.race([
      fetch(event.request),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), NAVIGATION_TIMEOUT_MS),
      ),
    ]);
    if (response.ok && response.type === "basic") {
      event.waitUntil(
        cache.put(event.request, response.clone()).then(() => trim(PAGES_CACHE, MAX_PAGES)),
      );
    }
    return response;
  } catch {
    return (
      (await cache.match(event.request, { ignoreVary: true })) ||
      (await caches.match(OFFLINE_URL)) ||
      Response.error()
    );
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Only same-origin requests. Station streams, HLS segments and artwork are never intercepted.
  if (url.origin !== self.location.origin) return;
  if (
    request.headers.has("range") ||
    request.destination === "audio" ||
    request.destination === "video"
  )
    return;

  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/images/")
  ) {
    event.respondWith(cacheFirst(request, SHELL_CACHE));
    return;
  }

  if (CACHEABLE_API.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(event, DATA_CACHE, MAX_DATA));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(event));
  }
});
