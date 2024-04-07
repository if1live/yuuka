import * as R from "remeda";
import type {
  DateText,
  DayText,
  MonthText,
  YearText,
} from "../../core/types.js";
import { LedgerService } from "../../ledgers/services/index.js";
import type { MyKysely } from "../../rdbms/types.js";
import type { AccountStatementTable } from "../../tables/index.js";
import { AccountStatementRepository } from "../repositories/index.js";

export const load = async (db: MyKysely, code: number, date: DateText) => {
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

  const statement = await AccountStatementRepository.loadByCodeAndDate(
    db,
    code,
    date_first,
  );

  const ledgers = await LedgerService.load(db, code, {
    start: date_first,
    end: date_nextDay,
  });

  return {
    statement,
    ledgers,
    balance: calculate({ statement, ledgers }),
  };
};

export const calculate = (params: {
  statement: AccountStatementTable.Row | undefined;
  ledgers: Awaited<ReturnType<(typeof LedgerService)["load"]>>;
}) => {
  const { statement, ledgers } = params;

  const ledger_debit = R.sumBy(ledgers, (x) => x.debit);
  const ledger_credit = R.sumBy(ledgers, (x) => x.credit);

  const statement_debit = statement?.totalDebit ?? 0;
  const statement_credit = statement?.totalCredit ?? 0;

  const total_debit = ledger_debit + statement_debit;
  const total_credit = ledger_credit + statement_credit;

  return {
    debit: total_debit,
    credit: total_credit,
    balance: total_debit - total_credit,
  };
};
