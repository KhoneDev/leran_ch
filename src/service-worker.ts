/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

const CACHE = `hsk-lao-v${version}`;

// Pre-cache essential app shell, icons, and HSK 1 vocabulary for instant 0ms offline startup
const PRECACHE = [
	'/',
	...build,
	...files.filter((f) => !f.endsWith('.map') && !f.includes('vocab.index.json')),
	'/data/hsk1.json'
];

self.addEventListener('install', (event: ExtendableEvent) => {
	event.waitUntil(
		caches
			.open(CACHE)
			.then(async (cache) => {
				// Cache critical items; catch errors gracefully for optional assets
				for (const url of PRECACHE) {
					try {
						await cache.add(url);
					} catch (e) {
						console.warn('Pre-cache skipped asset:', url, e);
					}
				}
			})
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event: ExtendableEvent) => {
	event.waitUntil(
		caches
			.keys()
			.then(async (keys) => {
				for (const key of keys) {
					if (key !== CACHE) {
						await caches.delete(key);
					}
				}
			})
			.then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (event: FetchEvent) => {
	if (event.request.method !== 'GET') return;

	const url = new URL(event.request.url);

	// Never intercept external CDNs unless necessary
	if (url.origin !== self.location.origin) return;
	if (!url.protocol.startsWith('http')) return;

	// 1. Immutable hashed Vite assets (/ _app/immutable/*) -> CACHE-FIRST (0ms instant)
	if (url.pathname.includes('/_app/immutable/')) {
		event.respondWith(
			caches.match(event.request).then((cached) => {
				if (cached) return cached;
				return fetch(event.request).then((response) => {
					if (response.ok) {
						const clone = response.clone();
						caches.open(CACHE).then((c) => c.put(event.request, clone));
					}
					return response;
				});
			})
		);
		return;
	}

	// 2. Vocabulary JSON data (/data/*.json or /vocab*.json) -> STALE-WHILE-REVALIDATE
	if (url.pathname.startsWith('/data/') || url.pathname.includes('vocab')) {
		event.respondWith(
			caches.match(event.request).then((cached) => {
				const networkFetch = fetch(event.request)
					.then((response) => {
						if (response.ok) {
							const clone = response.clone();
							caches.open(CACHE).then((c) => c.put(event.request, clone));
						}
						return response;
					})
					.catch(() => cached || new Response('Offline', { status: 503 }));

				return cached || networkFetch;
			})
		);
		return;
	}

	// 3. Navigation and other HTML requests -> Network-first with instant Cache fallback
	event.respondWith(
		fetch(event.request)
			.then((response) => {
				if (response.ok) {
					const clone = response.clone();
					caches.open(CACHE).then((cache) => {
						cache.put(event.request, clone);
					});
				}
				return response;
			})
			.catch(async () => {
				const cached = await caches.match(event.request);
				if (cached) return cached;

				if (event.request.mode === 'navigate') {
					const root = (await caches.match('/')) || (await caches.match('/index.html'));
					if (root) return root;
				}

				return new Response('Offline', { status: 503, statusText: 'Offline' });
			})
	);
});
