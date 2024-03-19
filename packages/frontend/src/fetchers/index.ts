import type { Hono } from "hono";
import { TOKEN_SECRET } from "../constants";

const host_dev = "http://localhost:3000";
const host_prod = "https://yuuka.shiroko.ne.kr";

const hostnames_localhost = ["localhost", "127.0.0.1"];
const host = hostnames_localhost.includes(window.location.hostname)
  ? host_dev
  : host_prod;

// TODO: auth token을 가져올 방법?
let authToken: string | undefined = undefined;
export const setAuthToken = (token: string) => {
  authToken = token;
};

// TODO: fetcher로 GET/POST 전부 대응하는게 맞나?
export const fetcherWithHttp = async (...args: unknown[]) => {
  const [first, _] = args;
  const url = `${host}${first}`;

  let headers: HeadersInit = {};
  if (authToken) {
    headers = {
      ...headers,
      Authorization: `Bearer ${authToken}`,
    };
  }

  const res = await fetch(url, {
    method: "GET",
    headers,
  });
  return await res.json();
};

export const fetcherWithApp = (app: Hono) => {
  const fn = async (...args: unknown[]) => {
    const [first, _] = args;
    const url = `${host}${first}`;

    // TODO: 하드코딩된 jwt
    // fast-jwt는 브라우저에서 작동하지 않아서 다른 툴을 찾아봐야
    const authToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxfQ.I1345epoxp-wyBKCNH8QY-YvT7e52fUgVhuJ_11IuKw";

    let headers: HeadersInit = {};
    if (authToken) {
      headers = {
        ...headers,
        Authorization: `Bearer ${authToken}`,
      };
    }

    const req = new Request(url, {
      method: "GET",
      headers,
    });

    // TODO: 멀쩡한 에러처리 붙이기. 로그도 있으면 좋겠는데. fetch 없이 로컬에서 다 돌리니까 요청이 뭐가 가나 안보인다.
    const resp = await app.fetch(req);
    const data = await resp.json();
    return data;
  };
  return fn;
};
