import * as R from "remeda";
import { Account } from "../../accounts/models/Account.js";
import type { DateOnly } from "../../core/types.js";
import { JournalLine } from "../../journals/models/JournalLine.js";
import type { MyKysely } from "../../rdbms/types.js";
import {
  AccountTransactionTable,
  LedgerTransactionTable,
} from "../../tables/index.js";

/**
 * 계정코드를 묶어서 볼수 있어야한다.
 * 102_000으로 검색하면 102_000 ~ 102_999까지 모아서 보기
 */
export const load = async (
  db: MyKysely,
  code: number,
  range: {
    start: DateOnly;
    end: DateOnly;
  },
) => {
  const groupCode = Account.toGroup(code);
  const isGroup = groupCode * 1000 === code;

  const load_plain = async () => {
    return await db
      .selectFrom(LedgerTransactionTable.name)
      .selectAll()
      .where("code", "=", code)
      .execute();
  };

  const load_group = async () => {
    return await db
      .selectFrom(LedgerTransactionTable.name)
      .selectAll()
      .where("code", ">=", groupCode * 1000)
      .where("code", "<", (groupCode + 1) * 1000)
      .execute();
  };

  const lines = isGroup ? await load_group() : await load_plain();
  if (lines.length <= 0) {
    return [];
  }

  const lineMap = new Map<string, JournalLine[]>();
  for (const line of lines) {
    const next = R.pipe(line, JournalLine.fromRow);
    const prev = lineMap.get(line.txid) ?? [];
    lineMap.set(line.txid, [...prev, next]);
  }

  // 날짜순으로 정렬된 journal entry로 보고싶다
  const rows = await db
    .selectFrom(AccountTransactionTable.name)
    .selectAll()
    .where(
      "txid",
      "in",
      lines.map((line) => line.txid),
    )
    .where("date", ">=", range.start)
    .where("date", "<", range.end)
    .orderBy("date", "asc")
    .execute();

  const ledgers = rows.flatMap((entry) => {
    const lines = lineMap.get(entry.txid);
    if (!lines) {
      throw new Error("entryLine not found");
    }

    // TODO: ledger 타입 어떻게 정의하지?
    return lines.map((line) => ({
      id: entry.txid,
      brief: entry.brief,
      date: entry.date,
      debit: line._tag === "debit" ? line.debit : 0,
      credit: line._tag === "credit" ? line.credit : 0,
    }));
  });
  return ledgers;
};
