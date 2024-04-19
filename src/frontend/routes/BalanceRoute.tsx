import { Anchor, Container } from "@mantine/core";
import { Link, Route, Routes } from "react-router-dom";
import { DateOnly } from "../../core/DateOnly.js";
import { TrialBalancePage } from "../features/balance/pages/TrialBalancePage.js";

export const BalanceRoute = () => (
  <Routes>
    <Route index element={<BalanceRootPage />} />
    <Route path="/trial-balance/:date" element={<TrialBalancePage />} />
  </Routes>
);

const BalanceRootPage = () => {
  const now = new Date();
  const date = DateOnly.fromDate(now);
  const url = `/balance/trial-balance/${date}`;
  return (
    <Container>
      <h1>balance</h1>

      <Anchor component={Link} to={url}>
        합계잔액시산표
      </Anchor>
    </Container>
  );
};
