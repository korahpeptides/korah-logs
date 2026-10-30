// Offline copy of the app (b77). build.mjs copies this to dist/<build>/sw.js and fills in __CACHE__.
//
// - The page itself: fetched fresh whenever there is a connection (so new builds arrive as before),
//   and kept in the cache. With no connection, or no answer in 6 seconds, the cached copy opens.
// - Firebase code and the fonts: cached the first time they load, then served from the cache.
// - Everything else (sync, Insights, analytics) is left alone and simply fails while offline.
const PAGE = __CACHE__;
const LIBS = "kl-libs";
const LIB_URLS = [/^https:\/\/www\.gstatic\.com\/firebasejs\//, /^https:\/\/fonts\.googleapis\.com\//, /^https:\/\/fonts\.gstatic\.com\//];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(PAGE)
      .then((c) => c.add(new Request("./", { cache: "reload" })))
      .catch(() => {})
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("kl-b") && k !== PAGE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function fromCache(name, key) {
  return caches.open(name).then((c) => c.match(key));
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (req.mode === "navigate" && url.origin === self.location.origin) {
    e.respondWith(
      new Promise((resolve) => {
        let done = false;
        const fallback = () =>
          fromCache(PAGE, "./").then((m) => {
            if (done) return;
            if (m) {
              done = true;
              resolve(m);
            }
          });
        const timer = setTimeout(fallback, 6000);
        fetch(req)
          .then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(PAGE).then((c) => c.put("./", copy));
            }
            clearTimeout(timer);
            if (!done) {
              done = true;
              resolve(res);
            }
          })
          .catch(() => {
            clearTimeout(timer);
            fromCache(PAGE, "./").then((m) => {
              if (!done) {
                done = true;
                resolve(m || Response.error());
              }
            });
          });
      }),
    );
    return;
  }

  if (LIB_URLS.some((x) => x.test(req.url))) {
    e.respondWith(
      fromCache(LIBS, req).then(
        (m) =>
          m ||
          fetch(req).then((res) => {
            if (res.ok || res.type === "opaque") {
              const copy = res.clone();
              caches.open(LIBS).then((c) => c.put(req, copy));
            }
            return res;
          }),
      ),
    );
  }
});
