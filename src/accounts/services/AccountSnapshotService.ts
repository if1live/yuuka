import { assert } from "@toss/assert";
import * as R from "remeda";
import { DateOnly } from "../../core/DateOnly.js";
import type { MyKysely } from "../../rdbms/types.js";
import { creditTag, debitTag } from "../../tables/LedgerTransactionTable.js";
import {
  type AccountStatementTable,
  AccountTransactionTable,
  LedgerTransactionTable,
} from "../../tables/index.js";
import { Account } from "../models/Account.js";
import type { AccountGroup } from "../models/AccountGroup.js";
import {
  AccountGroupRepository,
  AccountRepository,
  AccountStatementRepository,
} from "../repositories/index.js";

export const execute = async (db: MyKysely, date: DateOnly) => {
  const date_first = DateOnly.setDay(date, 1);
  const date_next = DateOnly.addDay(date, 1);

  const context = await load(db, date_first, date_next);

  const groupMap = new Map<number, AccountGroup>();
  for (const x of context.accountGroups) {
    groupMap.set(x.code, x);
  }

  return context.accounts.map((account) => {
    const groupCode = Account.toGroup(account.code);
    const group = groupMap.get(groupCode);
    assert(group);

    const statement = context.statements.find((x) => x.code === account.code);
    const ledgers = context.ledgers.filter((x) => x.code === account.code);
    const balance = calcualte(account, group, statement, ledgers);

    return {
      code: account.code,
      balance,
    };
  });
};

const calcualte = (
  account: Account,
  group: AccountGroup,
  statement: AccountStatementTable.Row | undefined,
  ledgers: LedgerTransactionTable.Row[],
) => {
  const debit = R.pipe(
    ledgers,
    R.filter((x) => x.tag === debitTag),
    R.sumBy((x) => x.amount),
  );
  const credit = R.pipe(
    ledgers,
    R.filter((x) => x.tag === creditTag),
    R.sumBy((x) => x.amount),
  );

  // 계정 분류에 따라서 계산 방법이 다르다.
  // 일괄적으로 계산하면 부호가 반대로 된거거나 하는 문제가 발생한다.
  switch (group.major) {
    case "asset": {
      const initial = statement?.closingBalance ?? 0;
      return initial + debit - credit;
    }
    case "equity": {
      const initial = statement?.closingBalance ?? 0;
      return initial + debit - credit;
    }
    case "liability": {
      const initial = statement?.closingBalance ?? 0;
      return initial + debit - credit;
    }
    case "revenue": {
      return credit;
    }
    case "expense": {
      return debit;
    }
  }
};

const load = async (db: MyKysely, startDate: DateOnly, endDate: DateOnly) => {
  const statements = await AccountStatementRepository.loadByDate(db, startDate);

  // TODO: 대충 떄려박고 나중에 옮기긴다
  const accounts = await AccountRepository.loadAll(db);
  const accountGroups = await AccountGroupRepository.loadAll(db);

  // TODO: join 잘 쓰면 한번에 될거같은데 일단은 간단하게 구현
  const transactions = await db
    .selectFrom(AccountTransactionTable.name)
    .select("txid")
    .where("date", ">=", startDate)
    .where("date", "<=", endDate)
    .execute();
  const transactionIds = transactions.map((x) => x.txid);

  const ledgers =
    transactionIds.length > 0
      ? await db
          .selectFrom(LedgerTransactionTable.name)
          .selectAll()
          .where("txid", "in", transactionIds)
          .execute()
      : [];

  return {
    accounts,
    accountGroups,
    statements,
    ledgers,
  };
};
