import * as R from "remeda";
import { z } from "zod";
import {
  AccountRepository,
  AccountStatementRepository,
} from "../accounts/repositories/index.js";
import { BalanceService } from "../accounts/services/index.js";
import {
  type DateText,
  type DayText,
  type MonthText,
  type YearText,
  dateSchema,
} from "../core/types.js";
import type { MyRequest } from "../networks/types.js";
import { creditTag, debitTag } from "../tables/LedgerTransactionTable.js";
import {
  AccountTransactionTable,
  LedgerTransactionTable,
} from "../tables/index.js";

export const GetReq = z.object({
  date: dateSchema,
  code: z.coerce.number(),
});
export type GetReq = z.infer<typeof GetReq>;

export const get = async (req: MyRequest<GetReq>) => {
  const db = req.db;
  const { date, code } = req.body;
  const result = await BalanceService.load(db, code, date);
  return result;
};
export type GetResp = Awaited<ReturnType<typeof get>>;

export const TrialBalanceReq = z.object({
  date: dateSchema,
});
export type TrialBalanceReq = z.infer<typeof TrialBalanceReq>;
export const trialBalance = async (req: MyRequest<TrialBalanceReq>) => {
  const db = req.db;
  const { date } = req.body;

  // TODO: 대충 떄려박고 나중에 옮기긴다
  const accounts = await AccountRepository.loadAll(db);

  // TODO: 날짜 연산 더 필요한데
  // 1일로 고정하는거
  const ymd = date.split("-") as [YearText, MonthText, DayText];
  const date_first = `${ymd[0]}-${ymd[1]}-01` as DateText;
  // TODO: 날짜 연산 더 필요한데. 다음날 지정
  const ts_base = new Date(date).getTime();
  const ts_nextDay = ts_base + 24 * 60 * 60 * 1000;
  const nextDayDate = ts_nextDay;
  const date_nextDay = new Date(nextDayDate)
    .toISOString()
    .split("T")[0] as DateText;

  const statements_all = await AccountStatementRepository.loadByDate(
    db,
    date_first,
  );

  // TODO: join 잘 쓰면 한번에 될거같은데 일단은 간단하게 구현
  const transactions = await db
    .selectFrom(AccountTransactionTable.name)
    .select("txid")
    .where("date", ">=", date_first)
    .where("date", "<", date_nextDay)
    .execute();
  const transactionIds = transactions.map((x) => x.txid);

  const ledgers_all =
    transactionIds.length > 0
      ? await db
          .selectFrom(LedgerTransactionTable.name)
          .selectAll()
          .where("txid", "in", transactionIds)
          .execute()
      : [];

  const results = [];
  for (const account of accounts) {
    const code = account.code;

    const ledgers = ledgers_all.filter((x) => x.code === code);
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

    // TODO: 잔액 시산표?
    const statement = statements_all.find((x) => x.code === code);
    // const debit_balance = (statement?.totalDebit ?? 0) + debit_sum;
    // const credit_balance = (statement?.totalCredit ?? 0) + credit_sum;

    results.push({
      code,
      debit_sum,
      // debit_balance,
      credit_sum,
      // credit_balance,
    });
  }
  return results;
};
export type TrialBalanceResp = Awaited<ReturnType<typeof trialBalance>>;
