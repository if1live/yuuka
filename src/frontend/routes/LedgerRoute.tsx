import { Route, Routes } from "react-router-dom";

export const LedgerRoute = () => (
  <Routes>
    <Route index element={<LedgerRootPage />} />
  </Routes>
);

export const LedgerRootPage = () => {
  return (
    <>
      <h1>ledger root</h1>
    </>
  );
};
