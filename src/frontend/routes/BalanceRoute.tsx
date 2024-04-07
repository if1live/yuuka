import { Route, Routes } from "react-router-dom";
import { BalanceReadPage } from "../features/balance/pages/BalanceReadPage.js";
import { BalanceRootPage } from "../features/balance/pages/BalanceRootPage.js";

export const BalanceRouter = () => (
  <Routes>
    <Route index element={<BalanceRootPage />} />
    <Route path="/:code/:date" element={<BalanceReadPage />} />
  </Routes>
);
