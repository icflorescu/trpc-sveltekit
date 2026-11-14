/// <reference lib="webworker" />
import { version } from '$app/env';
import { assets, immutable, prerendered } from '$app/manifest';
import { self } from '$app/service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [...immutable, ...assets, ...prerendered]
  .map(({ path }) => path)
  // LLM-friendly docs (`llms.txt`, `llms-full.txt`) are meant to be fetched fresh, so they're left out
  // of the precache; they're still served network-first, with the cache only as an offline fallback
  .filter((path) => !/(^|\/)llms(-full)?\.txt$/.test(path))
  // The manifest paths are relative to the base path (e.g. `internal/immutable/...`, or `''` for the
  // home page), so resolve them against the service worker scope (the base path) to get the absolute
  // pathnames that requests are matched against
  .map((path) => new URL(path, self.registration.scope).pathname);

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
  // Remove previous cached data from disk
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
      )
  );
});

self.addEventListener('fetch', (event) => {
  // ignore POST requests etc
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  const respond = async () => {
    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE);

    // build files and assets can always be served from the cache
    if (ASSETS.includes(url.pathname)) {
      const cached = await cache.match(event.request);
      if (cached) return cached;
    }

    // for everything else, try the network first, but
    // fall back to the cache if we're offline
    try {
      const response = await fetch(event.request);
      if (response.status === 200) cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      throw error;
    }
  };

  event.respondWith(respond());
});
