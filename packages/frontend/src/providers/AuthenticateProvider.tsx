import { userSpecification } from "@yuuka/core/dist/src/specifications";
import { type PropsWithChildren, useContext } from "react";
import useSWR from "swr";
import { StringParam, useQueryParams } from "use-query-params";
import { AuthContext, type AuthState } from "../contexts/AuthContext";
import { DataSourceContext } from "../contexts/DataSourceProvider";
import { setAuthToken } from "../fetchers";

// react-router 안쓰고 query string 손대는 편법
// https://github.com/pbeshai/use-query-params/issues/237#issuecomment-1825975483
export const myQueryParams = {
  username: StringParam,
} as const;

// 인증 사용하면 db 업로드, 다운로드 쓸수 있다
export const AuthenticateProvider = (props: PropsWithChildren) => {
  const database = useContext(DataSourceContext);

  // 샌드박스 모드에서는 인증 안쓴다.
  if (database.mode === "sandbox") {
    return <>{props.children}</>;
  }

  const [query, setQuery] = useQueryParams(myQueryParams);

  let username = "";
  if (query.username) {
    username = query.username;
  }
  if (database.username) {
    username = database.username;
  }
  if (!username) {
    return <div>username not found</div>;
  }

  const sheet = userSpecification.dataSheet;
  const spec = sheet.authenticate;
  type Req = (typeof spec)["inout"]["_in"];
  type Resp = (typeof spec)["inout"]["_out"];

  const req: Req = { username };
  const qs = new URLSearchParams(req);
  const endpoint = `${userSpecification.resource}${spec.endpoint.path}?${qs}`;
  const { data, error, isLoading } = useSWR(endpoint);
  const resp = data as Resp;

  if (error) {
    return <div>failed to authenticate</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  // TODO: fetcher로 auth token 넘기는 방법 생각나지 않아서 변수 깡을 설정
  setAuthToken(resp.authToken);

  const store: AuthState = {
    userId: resp.userId,
    authToken: resp.authToken,
  };

  return (
    <AuthContext.Provider value={store}>{props.children}</AuthContext.Provider>
  );
};
