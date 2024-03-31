import * as R from "remeda";
import { JournalEntryLine } from "../index.js";
import { AccountCode } from "../masterdata/types.js";
import {
  AccountTransactionSchema,
  type KyselyDB,
  LedgerTransactionSchema,
} from "../tables/index.js";

/**
 * 계정코드를 묶어서 볼수 있어야한다.
 * 102_000으로 검색하면 102_000 ~ 102_999까지 모아서 보기
 */
const load = async (
  db: KyselyDB,
  code: number,
  range: { start: string; end: string },
) => {
  const tagCode = AccountCode.toTag(code);
  const isTag = tagCode * 1000 === code;

  const load_plain = async () => {
    return await db
      .selectFrom(LedgerTransactionSchema.name)
      .selectAll()
      .where("code", "=", code)
      .execute();
  };

  const load_group = async () => {
    return await db
      .selectFrom(LedgerTransactionSchema.name)
      .selectAll()
      .where("code", ">=", tagCode * 1000)
      .where("code", "<", (tagCode + 1) * 1000)
      .execute();
  };

  const lines = isTag ? await load_group() : await load_plain();
  if (lines.length <= 0) {
    return [];
  }

  const entryLineMap = new Map<string, JournalEntryLine[]>();
  for (const line of lines) {
    const next = R.pipe(line, JournalEntryLine.fromRow);
    const prev = entryLineMap.get(line.entryId) ?? [];
    entryLineMap.set(line.entryId, [...prev, next]);
  }

  // 날짜순으로 정렬된 journal entry로 보고싶다
  const rows = await db
    .selectFrom(AccountTransactionSchema.name)
    .selectAll()
    .where(
      "entryId",
      "in",
      lines.map((line) => line.entryId),
    )
    .where("date", ">=", range.start)
    .where("date", "<", range.end)
    .orderBy("date", "asc")
    .execute();

  const ledgers = rows.flatMap((entry) => {
    const lines = entryLineMap.get(entry.entryId);
    if (!lines) {
      throw new Error("entryLine not found");
    }

    // TODO: ledger 타입 어떻게 정의하지?
    return lines.map((line) => ({
      id: entry.entryId,
      brief: entry.brief,
      date: entry.date,
      debit: line._tag === "debit" ? line.debit : 0,
      credit: line._tag === "credit" ? line.credit : 0,
    }));
  });
  return ledgers;
};

export const LedgerService = {
  load,
};
