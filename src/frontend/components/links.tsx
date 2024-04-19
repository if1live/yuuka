import { DateOnly } from "../../core/DateOnly.js";

export const createLedgerLink = (props: {
  code: number;
  date?: DateOnly | string;
}) => {
  const code = props.code < 1000 ? props.code * 1000 : props.code;

  const now = new Date();
  const initial = DateOnly.convertDateToRange(now);

  const date = props.date ?? initial.startDate;

  const url = `/ledger/account/${code}/${date}`;
  return url;
};
