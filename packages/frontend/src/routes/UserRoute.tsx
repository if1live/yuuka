import { Route, Routes } from "react-router-dom";
import { UserRootPage } from "../features/users/pages/UserRootPage";

export const UserRouter = () => (
  <Routes>
    <Route index element={<UserRootPage />} />
  </Routes>
);
