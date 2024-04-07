import { Route, Routes } from "react-router-dom";
import { BookQueryPage } from "../features/books/pages/BookQueryPage.js";
import { BookRootPage } from "../features/books/pages/BookRootPage.js";
import { BookTableListPage } from "../features/books/pages/BookTableListPage.js";

export const BookRouter = () => (
  <Routes>
    <Route index element={<BookRootPage />} />
    <Route path="/query" element={<BookQueryPage />} />
    <Route path="/tables" element={<BookTableListPage />} />
  </Routes>
);
