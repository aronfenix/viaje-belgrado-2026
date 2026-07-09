/* БЕОГРАД 26 · service worker — offline-first */
const VERSION = "bg26-v14";
const PRECACHE = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./js/map.js",
  "./js/fx.js",
  "./js/live.js",
  "./data/belgrado.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;

  // Map tiles: network only (too heavy to cache; map degrades offline)
  if (url.hostname.endsWith("tile.openstreetmap.org") || url.hostname.endsWith("basemaps.cartocdn.com")) return;

  // APIs en vivo (clima, cambio): red primero, caché como respaldo offline
  if (url.hostname === "api.open-meteo.com" || url.hostname === "open.er-api.com") {
    e.respondWith(
      fetch(e.request)
        .then((r) => { if (r.ok) { const c = r.clone(); caches.open(VERSION).then((x) => x.put(e.request, c)); } return r; })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Navigations: network first, cache fallback (so updates arrive but offline works)
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then((r) => { caches.open(VERSION).then((c) => c.put("./index.html", r.clone())); return r; })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Fonts + CDN + app assets: cache first (SOLO la caché de esta versión), luego red
  e.respondWith(
    caches.open(VERSION).then((c) => c.match(e.request)).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((r) => {
        const cacheable =
          url.origin === location.origin ||
          url.hostname === "fonts.googleapis.com" ||
          url.hostname === "fonts.gstatic.com" ||
          url.hostname === "unpkg.com";
        if (cacheable && r.ok) {
          const copy = r.clone();
          caches.open(VERSION).then((c) => c.put(e.request, copy));
        }
        return r;
      });
    })
  );
});
