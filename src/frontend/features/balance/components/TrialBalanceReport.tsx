import { Button, SegmentedControl } from "@mantine/core";
import { useState } from "react";
import * as R from "remeda";
import type { BalanceController } from "../../../../controllers/mod.js";
import { TrialBalanceTable } from "./TrialBalanceTable.js";

type AccountBalance = BalanceController.TrialBalanceResp["accounts"][number];

const convertBalance_AccountPlain = (accounts: AccountBalance[]) => {
  return accounts;
};

const convertBalance_AccountGroup = (accounts: AccountBalance[]) => {
  return R.pipe(
    accounts,
    R.groupBy((x) => Math.floor(x.code / 1000)),
    R.entries(),
    R.map((x) => {
      const [groupCode, accounts] = x;
      const account = {
        code: Number.parseInt(groupCode) * 1000,
        debit_balance: R.sumBy(accounts, (x) => x.debit_balance),
        credit_balance: R.sumBy(accounts, (x) => x.credit_balance),
        debit_sum: R.sumBy(accounts, (x) => x.debit_sum),
        credit_sum: R.sumBy(accounts, (x) => x.credit_sum),
      };
      return account;
    }),
  );
};

export const TrialBalanceReport = (props: {
  resp: BalanceController.TrialBalanceResp;
}) => {
  const { resp } = props;
  const { accounts, date_first, date_end } = resp;

  const [value, setValue] = useState("group");

  return (
    <>
      <h1>합계잔액시산표</h1>
      <p>
        {date_first} ~ {date_end}
      </p>

      <SegmentedControl
        data={["group", "plain"] as const}
        value={value}
        onChange={setValue}
      />

      {value === "plain" ? (
        <TrialBalanceTable accounts={convertBalance_AccountPlain(accounts)} />
      ) : null}
      {value === "group" ? (
        <TrialBalanceTable accounts={convertBalance_AccountGroup(accounts)} />
      ) : null}
    </>
  );
};
