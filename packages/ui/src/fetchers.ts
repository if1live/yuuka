import { supabase } from "./constants";

const host_localhost = "http://127.0.0.1:3000";

// 귀찮아서 하드코딩. custom domain으로 나중에 교체
const host_lambda =
  "https://9hd4nt7gl2.execute-api.ap-northeast-1.amazonaws.com";

const host_dev = host_localhost;
const host_prod = host_lambda;

const host = import.meta.env.DEV ? host_dev : host_prod;

export const myfetch = async (input: string, init?: RequestInit) => {
  const result_session = await supabase.auth.getSession();
  if (result_session.error) {
    return;
  }

  const session = result_session.data.session;
  const accessToken: string = session?.access_token ?? "";

  const headers_input: HeadersInit = init?.headers ?? {};
  const headers_custom: HeadersInit = {
    Authorization: `Bearer ${accessToken}`,
  };
  const headers: HeadersInit = { ...headers_input, ...headers_custom };

  const endpoint = `${host}${input}`;
  const resp = await fetch(endpoint, {
    ...init,
    headers,
  });
  if (resp.status < 400) {
    const resp2 = resp.clone();
    const json = await resp2.json();
    return json;
  }

  // json으로 읽을수 있는 경우
  let json: Record<string, string> | undefined = undefined;
  try {
    const resp2 = resp.clone();
    json = await resp2.json();
  } catch (e) {
    json = undefined;
  }

  if (typeof json !== "undefined") {
    const name = json.name;
    const message = json.message;

    const e = Error(message ?? "unknown error");
    e.name = name;

    throw e;
  }

  const text = await resp.text();
  throw new Error(`fetch failed: ${resp.statusText}`);
};
