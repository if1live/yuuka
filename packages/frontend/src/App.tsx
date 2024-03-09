import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./App.css";
import type { MasterDataRoot } from "./contexts/MasterDataContext";
import { MasterDataContext } from "./contexts/MasterDataContext";
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
  // TODO: 마스터데이터
  const store: MasterDataRoot = {
    accountTags: [],
    accountCodes: [],
  };

  return (
    <MasterDataContext.Provider value={store}>
      <RouterProvider router={router} />
    </MasterDataContext.Provider>
  );
};
