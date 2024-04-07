import { Route, Routes } from "react-router-dom";
/*
import { LedgerReadPage } from "../features/ledgers/pages/LedgerReadPage";
import { LedgerRootPage } from "../features/ledgers/pages/LedgerRootPage";
*/

export const LedgerRouter = () => (
  <Routes>
    <Route index element={<LedgerRootPage />} />
    <Route
      path="/account/:code/:startDate/:endDate"
      element={<LedgerReadPage />}
    />
  </Routes>
);

const LedgerReadPage = () => {
  return <div>LedgerReadPage</div>;
};

const LedgerRootPage = () => {
  return <div>LedgerRootPage</div>;
};
