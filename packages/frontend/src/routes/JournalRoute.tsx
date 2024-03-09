import { Route, Routes } from "react-router-dom";
import {
  JournalEntryListPage,
  JournalEntryReadPage,
  JournalEntryRootPage,
} from "../features/journals/pages";

export const JournalRouter = () => (
  <Routes>
    <Route index element={<JournalEntryRootPage />} />
    <Route
      path="/list/:startDate/:endDate"
      element={<JournalEntryListPage />}
    />
    <Route path="/entry/:id" element={<JournalEntryReadPage />} />
  </Routes>
);
