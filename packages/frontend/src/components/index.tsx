import { useContext } from "react";
import { Link } from "react-router-dom";
import { MasterDataContext } from "../contexts/MasterDataContext";

export const CurrencyDisplay = (props: {
  amount: number;
}) => {
  const { amount } = props;
  return <span>{amount}</span>;
};

export const AccountCodeLink = (props: {
  code: number;
}) => {
  const { accountCodes } = useContext(MasterDataContext);

  const { code } = props;

  const url = "/TODO";

  return <Link to={url}>{code}</Link>;
};

export const JournalEntryLink = (props: {
  id: string;
}) => {
  const { id } = props;
  const url = `/journal/entry/${id}`;
  return <Link to={url}>{id}</Link>;
};
