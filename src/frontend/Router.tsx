import {
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { BalanceRouter } from "./routes/BalanceRoute.js";
import { BookRouter } from "./routes/BookRoute.js";
import { JournalRouter } from "./routes/JournalRoute.js";
import { LedgerRouter } from "./routes/LedgerRoute.js";
import { Root } from "./routes/Root.js";

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="/journal/*" element={<JournalRouter />} />
      <Route path="/ledger/*" element={<LedgerRouter />} />
      <Route path="/balance/*" element={<BalanceRouter />} />
      <Route path="/book/*" element={<BookRouter />} />
    </Route>,
  ),
  {
    // hash router에서는 없어야 제대로 작동한다.
    // browser router 쓸때는 basename 붙어야 작동한다.
    // github pages 기준으로는 어차피 정적 파일밖에 안되니까 hash router로 선택
    // index.html을 404.html로 복사하는 편법을 쓰면 browser router 쓸 수 있긴하더라
    // basename: "/yuuka",
  },
);

export const Router = () => {
  return <RouterProvider router={router} />;
};
