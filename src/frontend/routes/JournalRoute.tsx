import { Route, Routes } from "react-router-dom";
import { JournalCreatePage } from "../features/journals/pages/JournalCreatePage.js";
import { JournalEditPage } from "../features/journals/pages/JournalEditPage.js";
import { JournalListPage } from "../features/journals/pages/JournalListPage.js";
import { JournalReadPage } from "../features/journals/pages/JournalReadPage.js";
import { JournalRootPage } from "../features/journals/pages/JournalRootPage.js";

export const JournalRoute = () => (
  <Routes>
    <Route index element={<JournalRootPage />} />
    <Route path="/list/:startDate/:endDate" element={<JournalListPage />} />
    <Route path="/action/create" element={<JournalCreatePage />} />
    <Route path="/transaction/:id" element={<JournalReadPage />} />
    <Route path="/transaction/:id/edit" element={<JournalEditPage />} />
  </Routes>
);
