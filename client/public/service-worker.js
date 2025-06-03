const CACHE_NAME = 'chips-cache-v1';

const URLS_TO_CACHE = [
	'/',
	'/index.html',
	'/manifest.json',
	'/assets/dolearn-icon/dolearn-icon-128.png',
	'/assets/dolearn-icon/dolearn-icon-144.png',
	'/assets/dolearn-icon/dolearn-icon-150.png',
	'/assets/dolearn-icon/dolearn-icon-270.png',
	'/assets/dolearn-icon/dolearn-icon-310.png',
	'/assets/dolearn-icon/dolearn-icon-512.png',
	'/assets/dolearn-icon/dolearn-icon-558.png',
];

// 설치 단계 - 캐시 저장
self.addEventListener('install', (event) => {
	console.log('[Service Worker] Install');
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(URLS_TO_CACHE);
		}),
	);
});

// 활성화 단계 - 오래된 캐시 정리
self.addEventListener('activate', (event) => {
	console.log('[Service Worker] Activate');
	event.waitUntil(
		caches.keys().then((keyList) =>
			Promise.all(
				keyList.map((key) => {
					if (key !== CACHE_NAME) {
						return caches.delete(key);
					}
				}),
			),
		),
	);
});

// 요청 가로채기 - 캐시된 응답 제공 or 네트워크
self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			return (
				cachedResponse ||
				fetch(event.request).catch(() => {
					// 오프라인 fallback 넣으려면 여기에 작성
				})
			);
		}),
	);
});
