import { Anchor } from "@mantine/core";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { Account } from "../../accounts/models/Account.js";
import { AccountCategory } from "../../accounts/models/AccountCategory.js";
import { convertDateToRange } from "../helpers/index.js";
import { MasterDataContext } from "../providers/MasterDataContext.js";
import type { DateOnly } from "../../core/DateOnly.js";

// TODO: 상세 내용은 상황에 따라 자주 바뀔거같은데
export const AccountLink = (props: {
  code: number;
  startDate?: DateOnly | string;
  endDate?: DateOnly | string;
}) => {
  const { accounts, accountGroups } = useContext(MasterDataContext);
  const code = props.code < 1000 ? props.code * 1000 : props.code;

  const account = accounts.find((x) => x.code === code);

  const groupCode = Account.toGroup(code);
  const group = accountGroups.find((x) => x.code === groupCode);

  const now = new Date();
  const initial = convertDateToRange(now);

  const startDate = props.startDate ?? initial.startDate;
  const endDate = props.endDate ?? initial.endDate;

  const url = `/ledger/account/${code}/${startDate}/${endDate}`;

  const major = group ? AccountCategory.toKorean(group.major) : "unknown";
  const minor = group?.minor ?? "unknown";

  return (
    <Anchor component={Link} to={url}>
      [{code}] {major} {">"} {minor} {">"} {account?.name}
    </Anchor>
  );
};
