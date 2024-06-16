import { Route, Routes } from "react-router-dom";
import { UserRootPage } from "../features/users/pages/UserRootPage.js";

export const UserRoute = () => (
  <Routes>
    <Route index element={<UserRootPage />} />
  </Routes>
);
