import { Route, Routes } from "react-router-dom";
import { AccountRootPage } from "../features/accounts/pages/AccountRootPage.js";
import { AccountSnapshotPage } from "../features/accounts/pages/AccountSnapshotPage.js";

export const AccountRoute = () => (
  <Routes>
    <Route index element={<AccountRootPage />} />
    <Route path="/snapshot/:date" element={<AccountSnapshotPage />} />
  </Routes>
);
