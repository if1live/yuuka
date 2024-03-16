import { resourceSpecification } from "@yuuka/core";
import { userSpecification } from "@yuuka/core/dist/src/specifications";
import type { PropsWithChildren } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { SWRConfig } from "swr";
import useSWRImmutable from "swr/immutable";
import {
  QueryParamProvider,
  StringParam,
  useQueryParams,
} from "use-query-params";
import { WindowHistoryAdapter } from "use-query-params/adapters/window";
import "./App.css";
import { AuthContext, type AuthState } from "./contexts/AuthContext";
import type { MasterDataRoot } from "./contexts/MasterDataContext";
import { MasterDataContext } from "./contexts/MasterDataContext";
import { fetcher, setAuthToken } from "./fetchers";
import { JournalRouter } from "./routes/JournalRoute";
import { LedgerRouter } from "./routes/LedgerRoute";
import { Root } from "./routes/Root";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="/journal/*" element={<JournalRouter />} />
      <Route path="/ledger/*" element={<LedgerRouter />} />
    </Route>,
  ),
);

// react-router 안쓰고 query string 손대는 편법
// https://github.com/pbeshai/use-query-params/issues/237#issuecomment-1825975483
export const myQueryParams = {
  username: StringParam,
} as const;

const WithAuthenticate = (props: PropsWithChildren) => {
  const [query, setQuery] = useQueryParams(myQueryParams);
  if (!query.username) {
    return <div>username not found</div>;
  }

  const sheet = userSpecification.dataSheet;
  const spec = sheet.authenticate;
  type Req = (typeof spec)["inout"]["_in"];
  type Resp = (typeof spec)["inout"]["_out"];

  const req: Req = {
    username: query.username,
  };
  const qs = new URLSearchParams(req);
  const endpoint = `${userSpecification.resource}${spec.endpoint.path}?${qs}`;
  const { data, error, isLoading } = useSWRImmutable(endpoint, fetcher);
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

export const WithMasterData = (props: PropsWithChildren) => {
  // 마스터데이터
  const sheet = resourceSpecification.dataSheet;
  const spec = sheet.masterdata;

  const endpoint = `${resourceSpecification.resource}${spec.endpoint.path}`;
  const { data, error, isLoading } = useSWRImmutable(endpoint, fetcher);
  const resp = data as (typeof spec)["inout"]["_out"];

  if (error) {
    return <div>failed to load masterdata</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  const store: MasterDataRoot = {
    accountTags: resp.accountTags,
    accountCodes: resp.accountCodes,
  };

  return (
    <MasterDataContext.Provider value={store}>
      {props.children}
    </MasterDataContext.Provider>
  );
};

export const App = () => (
  <QueryParamProvider adapter={WindowHistoryAdapter}>
    <SWRConfig
      value={{
        shouldRetryOnError: false,
      }}
    >
      <WithAuthenticate>
        <WithMasterData>
          <RouterProvider router={router} />
        </WithMasterData>
      </WithAuthenticate>
    </SWRConfig>
  </QueryParamProvider>
);
