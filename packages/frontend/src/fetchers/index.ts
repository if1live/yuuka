import type { Hono } from "hono";

const host = "http://localhost:3000";

// use-swr은 데이터 읽기에서만 쓸거니까 GET로 하드코딩
export const fetcherWithFunc = (myfetch: typeof fetch) => {
  return async (...args: unknown[]) => {
    const [first, _] = args;
    const url = `${host}${first}`;

    const res = await myfetch(url, {
      method: "GET",
    });
    return await res.json();
  };
};

export const fetcherWithHttp = () => {
  return fetcherWithFunc(fetch);
};

export const fetcherWithApp = (app: Hono) => {
  const myfetch: typeof fetch = async (input, init) => {
    return await app.request(input, init);
  };
  return fetcherWithFunc(myfetch);
};
