import { Route, Routes } from "react-router-dom";
import { JournalEntryListPage } from "../features/journals/pages/JournalEntryListPage";
import { JournalEntryReadPage } from "../features/journals/pages/JournalEntryReadPage";
import { JournalEntryRootPage } from "../features/journals/pages/JournalEntryRootPage";

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
