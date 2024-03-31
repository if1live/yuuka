import { AccountCategory, AccountCode } from "@yuuka/core";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { MasterDataContext } from "../contexts/MasterDataContext";
import { convertDateToRange } from "../features/ledgers/pages/LedgerRootPage";

export const CurrencyDisplay = (props: {
  amount: number;
}) => {
  const { amount } = props;
  const formatter = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  });
  return <span>{formatter.format(amount)}</span>;
};

export const AccountCodeLink = (props: {
  code: number;
  startDate?: string;
  endDate?: string;
}) => {
  const { accountCodes, accountTags } = useContext(MasterDataContext);
  const code = props.code < 1000 ? props.code * 1000 : props.code;

  const account = accountCodes.find((x) => x.code === code);

  const tagCode = AccountCode.toTag(code);
  const tag = accountTags.find((x) => x.code === tagCode);

  const now = new Date();
  const initial = convertDateToRange(now);

  const startDate = props.startDate ?? initial.startDate;
  const endDate = props.endDate ?? initial.endDate;

  const url = `/ledger/account/${code}/${startDate}/${endDate}`;

  const major = tag ? AccountCategory.toKorean(tag.major) : "unknown";
  const minor = tag?.minor ?? "unknown";

  return (
    <Link to={url}>
      [{code}] {major} {">"} {minor} {">"} {account?.name}
    </Link>
  );
};

export const JournalEntryLink = (props: {
  label?: string;
  id: string;
}) => {
  const { id, label } = props;
  const text = label ?? id;
  const url = `/journal/entry/${id}`;
  return <Link to={url}>{text}</Link>;
};
