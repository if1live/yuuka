import {
  JournalEntryLineSchema,
  JournalEntrySchema,
  type KyselyDB,
} from "@yuuka/db";
import * as R from "remeda";
import { JournalEntryLine } from "../index.js";
import { AccountCode } from "../masterdata/types.js";

const load = async (
  db: KyselyDB,
  code: number,
  range: { start: string; end: string },
) => {
  const tagCode = AccountCode.toTag(code);
  const isTag = tagCode * 1000 === code;

  const load_plain = async () => {
    return await db
      .selectFrom(JournalEntryLineSchema.name)
      .selectAll()
      .where("code", "=", code)
      .execute();
  };

  const load_group = async () => {
    return await db
      .selectFrom(JournalEntryLineSchema.name)
      .selectAll()
      .where("code", ">=", tagCode * 1000)
      .where("code", "<", (tagCode + 1) * 1000)
      .execute();
  };

  const lines = isTag ? await load_group() : await load_plain();
  if (lines.length <= 0) {
    return [];
  }

  // TODO: 계정코드를 묶어서 볼수 있어야한다.
  // 102001 -> 102002 송금은 102로 검색하면 나와야한다.
  // 이런 경우 entry_id 1개에 n개의 line이 발생할 수 있다!
  const entryLineMap = new Map(
    lines.map((line) => {
      const next = R.pipe(line, JournalEntryLine.fromRow);
      return [line.entryId, next];
    }),
  );

  // 날짜순으로 정렬된 journal entry로 보고싶다
  const rows = await db
    .selectFrom(JournalEntrySchema.name)
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

  const ledgers = rows.map((entry) => {
    const entryLine = entryLineMap.get(entry.entryId);
    if (!entryLine) {
      throw new Error("entryLine not found");
    }

    return {
      id: entry.entryId,
      brief: entry.brief,
      date: entry.date,
      debit: entryLine._tag === "debit" ? entryLine.debit : 0,
      credit: entryLine._tag === "credit" ? entryLine.credit : 0,
    };
  });
  return ledgers;
};

export const LedgerService = {
  load,
};
