import { Route, Routes } from "react-router-dom";
import { JournalEntryListPage } from "../features/journals/pages/JournalEntryListPage";
import { JournalEntryReadPage } from "../features/journals/pages/JournalEntryReadPage";
import { JournalEntryRootPage } from "../features/journals/pages/JournalEntryRootPage";
import { JournalEntryEditPage } from "../features/journals/pages/JournalEntryEditPage";
import { JournalEntryCreatePage } from "../features/journals/pages/JournalEntryCreatePage";

export const JournalRouter = () => (
  <Routes>
    <Route index element={<JournalEntryRootPage />} />
    <Route
      path="/list/:startDate/:endDate"
      element={<JournalEntryListPage />}
    />
    <Route path="/entry/:id" element={<JournalEntryReadPage />} />
    <Route path="/entry/:id/edit" element={<JournalEntryEditPage />} />
    <Route path="/action/create" element={<JournalEntryCreatePage />} />
  </Routes>
);
