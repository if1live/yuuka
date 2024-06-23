import { supabase } from "./constants";

const host = "http://127.0.0.1:3000";

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
  const json = await resp.json();
  return json;
};
