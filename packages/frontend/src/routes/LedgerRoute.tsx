import { Route, Routes } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "../fetchers";

export const LedgerRouter = () => (
  <Routes>
    <Route index element={<LedgerRootPage />} />
    <Route path="/code/:code" element={<LedgerReadPage />} />
  </Routes>
);

const LedgerRootPage = () => {
  const { data, error, isLoading } = useSWR("/api/user", fetcher);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  return <div>hello {data.name}!</div>;
};

// /ledger/123 <- 모아보기 3자리
// /ledger/123123 <- 상세보기 6자리
const LedgerReadPage = () => {
  return <div>read</div>;
};
