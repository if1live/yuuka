import { Route, Routes } from "react-router-dom";
import { JournalEntryCreatePage } from "../features/journals/pages/JournalEntryCreatePage.js";
import { JournalRootPage } from "../features/journals/pages/JournalRootPage.js";

export const JournalRoute = () => (
  <Routes>
    <Route index element={<JournalRootPage />} />
    <Route path="/action/create" element={<JournalEntryCreatePage />} />
  </Routes>
);
