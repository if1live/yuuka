import { resourceSpecification } from "@yuuka/core";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import useSWRImmutable from "swr/immutable";
import "./App.css";
import type { MasterDataRoot } from "./contexts/MasterDataContext";
import { MasterDataContext } from "./contexts/MasterDataContext";
import { fetcher } from "./fetchers";
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

export const App = () => {
  // 마스터데이터
  const sheet = resourceSpecification.dataSheet;
  const spec = sheet.masterdata;

  const endpoint = `${resourceSpecification.resource}${spec.endpoint.path}`;
  const { data, error, isLoading } = useSWRImmutable(endpoint, fetcher);
  const resp = data as (typeof spec)["inout"]["_out"];

  if (error) {
    return <div>failed to load</div>;
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
      <RouterProvider router={router} />
    </MasterDataContext.Provider>
  );
};
