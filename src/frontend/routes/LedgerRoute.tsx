import { Route, Routes } from "react-router-dom";
import { LedgerReadPage } from "../features/ledgers/pages/LedgerReadPage.js";
import { LedgerRootPage } from "../features/ledgers/pages/LedgerRootPage.js";

export const LedgerRoute = () => (
  <Routes>
    <Route index element={<LedgerRootPage />} />
    <Route path="/account/:code/:date" element={<LedgerReadPage />} />
  </Routes>
);
