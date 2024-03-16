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
export const fetcher = async (...args: unknown[]) => {
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
