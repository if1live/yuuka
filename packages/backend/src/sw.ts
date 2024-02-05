import { app } from "./app.js";

self.addEventListener("install", (ev) => {
  const evt = ev as ExtendableEvent;

  // 설치 작업을 처리합니다. 예를 들어 캐시 파일 목록을 저장할 수 있습니다.
  // TODO: vite로 생성되는 파일은 어떻게 대응하지?
  evt.waitUntil(
    caches.open("v1").then(async (cache) => {
      // TODO: Uncaught (in promise) TypeError: Failed to execute 'addAll' on 'Cache': Request failed
      // 배포 이후 발생하는 에러 언제 고치냐...
      // cache.addAll(["/index.html", "/styles/main.css", "/scripts/main.js"]);
      await cache.addAll(["/index.html"]);
    }),
  );
});

self.addEventListener("fetch", (ev) => {
  const evt = ev as FetchEvent;

  // 이유를 모르겠는데 콘솔 출력이 사라지면 동작이 바뀐다?
  // 초기화에 걸리는 시간이 영향을 주나??
  console.log("fetch_1", evt.request);

  // 네트워크 요청을 가로채고 캐시된 응답을 제공하거나 네트워크에서 가져옵니다.
  evt.respondWith(
    caches.match(evt.request).then(async (response) => {
      // 이유를 모르겠는데 콘솔 출력이 사라지면 동작이 바뀐다?
      console.log("fetch_2", evt.request);

      const url = new URL(evt.request.url);
      if (url.pathname.startsWith("/api/")) {
        return await app.fetch(evt.request);
      }

      // else...
      return response || (await fetch(evt.request));
    }),
  );
});
