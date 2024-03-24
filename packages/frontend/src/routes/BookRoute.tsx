import { Route, Routes } from "react-router-dom";
import { BookRootPage } from "../features/books/pages/BookRootPage";

export const BookRouter = () => (
  <Routes>
    <Route index element={<BookRootPage />} />
  </Routes>
);
