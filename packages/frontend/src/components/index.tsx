import { AccountCategory, AccountCode } from "@yuuka/core";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { MasterDataContext } from "../contexts/MasterDataContext";

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
}) => {
  const { accountCodes, accountTags } = useContext(MasterDataContext);
  const code = props.code < 1000 ? props.code * 1000 : props.code;

  const account = accountCodes.find((x) => x.code === code);

  const tagCode = AccountCode.toTag(code);
  const tag = accountTags.find((x) => x.code === tagCode);

  const url = `/ledger/account/${code}`;

  const major = tag ? AccountCategory.toKorean(tag.major) : "unknown";
  const minor = tag?.minor ?? "unknown";

  return (
    <Link to={url}>
      [{code}] {major} {">"} {minor} {">"} {account?.name}
    </Link>
  );
};

export const JournalEntryLink = (props: {
  id: string;
}) => {
  const { id } = props;
  const url = `/journal/entry/${id}`;
  return <Link to={url}>{id}</Link>;
};
