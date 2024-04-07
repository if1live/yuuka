import { Route, Routes } from "react-router-dom";
/*
import { JournalEntryCreatePage } from "../features/journals/pages/JournalEntryCreatePage";
import { JournalEntryEditPage } from "../features/journals/pages/JournalEntryEditPage";
import { JournalEntryListPage } from "../features/journals/pages/JournalEntryListPage";
import { JournalEntryReadPage } from "../features/journals/pages/JournalEntryReadPage";
import { JournalEntryRootPage } from "../features/journals/pages/JournalEntryRootPage";
*/

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

const JournalEntryCreatePage = () => {
  return <div>JournalEntryCreatePage</div>;
};

const JournalEntryEditPage = () => {
  return <div>JournalEntryEditPage</div>;
};

const JournalEntryListPage = () => {
  return <div>JournalEntryListPage</div>;
};

const JournalEntryReadPage = () => {
  return <div>JournalEntryReadPage</div>;
};

const JournalEntryRootPage = () => {
  return <div>JournalEntryRootPage</div>;
};
