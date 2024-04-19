import * as R from "remeda";
import type { DateOnly } from "../../core/types.js";
import type { MyKysely } from "../../rdbms/types.js";
import { creditTag, debitTag } from "../../tables/LedgerTransactionTable.js";
import { LedgerTransactionTable } from "../../tables/index.js";
import type { Account } from "../models/Account.js";
import { AccountRepository } from "../repositories/index.js";

export const report = async (
  db: MyKysely,
  startDate: DateOnly,
  endDate: DateOnly,
) => {
  const data = await load(db, startDate, endDate);

  return data.accounts.map((account) => {
    const code = account.code;
    const ledgers = data.ledgers.filter((x) => x.code === code);
    const result = calculate(account, ledgers);
    return result;
  });
};

const load = async (db: MyKysely, startDate: DateOnly, endDate: DateOnly) => {
  // TODO: 대충 떄려박고 나중에 옮기긴다
  const accounts = await AccountRepository.loadAll(db);

  const ledgers = await db
    .selectFrom(LedgerTransactionTable.name)
    .selectAll()
    .where("date", ">=", startDate)
    .where("date", "<=", endDate)
    .execute();

  return {
    accounts,
    ledgers,
  };
};

const calculate = (account: Account, ledgers: LedgerTransactionTable.Row[]) => {
  const code = account.code;

  const debit_sum = R.pipe(
    ledgers,
    R.filter((x) => x.tag === debitTag),
    R.sumBy((x) => x.amount),
  );
  const credit_sum = R.pipe(
    ledgers,
    R.filter((x) => x.tag === creditTag),
    R.sumBy((x) => x.amount),
  );

  // 잔액 시산표?
  const debit_balance = debit_sum > credit_sum ? debit_sum - credit_sum : 0;
  const credit_balance = credit_sum > debit_sum ? credit_sum - debit_sum : 0;

  return {
    code,
    debit_sum,
    debit_balance,
    credit_sum,
    credit_balance,
  };
};
