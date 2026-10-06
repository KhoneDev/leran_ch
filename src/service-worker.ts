/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

const CACHE = `hsk-lao-v${version}`;

// Only pre-cache essential code bundle and icons (NOT large JSON datasets)
const PRECACHE = [
	'/',
	...build,
	...files.filter((f) => !f.endsWith('.json') && !f.endsWith('.map') && !f.startsWith('/data/'))
];

self.addEventListener('install', (event: ExtendableEvent) => {
	event.waitUntil(
		caches
			.open(CACHE)
			.then((cache) => cache.addAll(PRECACHE))
			.then(() => self.skipWaiting())
			.catch((err: unknown) => {
				console.warn('PWA install precache skipped non-critical assets:', err);
			})
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

	// 1. NEVER intercept third-party/CDN requests (HanziWriter, external fonts, etc.)
	if (url.origin !== self.location.origin) return;

	// 2. Ignore non-http requests
	if (!url.protocol.startsWith('http')) return;

	// 3. Fast Network-First strategy with Cache Fallback for same-origin assets
	event.respondWith(
		fetch(event.request)
			.then((response) => {
				if (response.status === 200) {
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
					const root = await caches.match('/');
					if (root) return root;
				}

				return new Response('Offline', { status: 503, statusText: 'Offline' });
			})
	);
});
