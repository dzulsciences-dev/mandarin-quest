const BASE_URL = new URL('.', self.location).pathname
const INDEX_URL = `${BASE_URL}index.html`
const CACHE_PREFIX = 'mandarin-quest-'
const APP_CACHE_PREFIX = `${CACHE_PREFIX}${BASE_URL.replaceAll('/', '-')}-`
const CACHE = `${APP_CACHE_PREFIX}v6`
const SHELL = [BASE_URL, INDEX_URL, `${BASE_URL}manifest.webmanifest`, `${BASE_URL}icon.svg`, `${BASE_URL}apple-touch-icon.png`, `${BASE_URL}icon-192.png`, `${BASE_URL}icon-512.png`]
self.addEventListener('install', event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE)
  await cache.addAll(SHELL)
  const index = await cache.match(INDEX_URL)
  if (index) {
    const html = await index.text()
    const assets = [...html.matchAll(/\b(?:src|href)="([^"]+)"/g)]
      .map(([, path]) => new URL(path, self.location.origin))
      .filter(url => url.origin === self.location.origin && url.pathname.startsWith(BASE_URL))
      .map(url => url.href)
    await cache.addAll(assets)
  }
  await self.skipWaiting()
})()))
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(APP_CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())))
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put(INDEX_URL, response.clone()))
      return response
    }).catch(() => caches.match(INDEX_URL).then(cached => cached || Response.error())))
    return
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)) }
    return response
  })))
})
