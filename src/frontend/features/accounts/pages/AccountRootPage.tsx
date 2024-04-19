import { Navigate } from "react-router-dom";
import * as R from "remeda";
import { DateOnly } from "../../../../core/DateOnly.js";

export const AccountRootPage = () => {
  const now = new Date();
  const date = R.pipe(
    now,
    (x) => DateOnly.fromDate(now),
    (x) => DateOnly.setDayAsLastDayOfMonth(x),
  );

  const url_snapshot = `/account/snapshot/${date}`;
  return <Navigate replace to={url_snapshot} />;
};
