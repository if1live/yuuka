import { Route, Routes } from "react-router-dom";
import { LedgerRootPage } from "../features/ledgers/pages/LedgerRootPage";

export const LedgerRoute = () => (
  <Routes>
    <Route index element={<LedgerRootPage />} />
  </Routes>
);
