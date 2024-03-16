import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { WindowHistoryAdapter } from "use-query-params/adapters/window";
import "./App.css";
import { AuthenticateProvider } from "./providers/AuthenticateProvider";
import { DataSourceProvider } from "./providers/DataSourceProvider";
import { MasterDataProvider } from "./providers/MasterDataProvider";
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
  {
    basename: "/yuuka",
  },
);

export const App = () => (
  <QueryParamProvider adapter={WindowHistoryAdapter}>
    <DataSourceProvider>
      <AuthenticateProvider>
        <MasterDataProvider>
          <RouterProvider router={router} />
        </MasterDataProvider>
      </AuthenticateProvider>
    </DataSourceProvider>
  </QueryParamProvider>
);
