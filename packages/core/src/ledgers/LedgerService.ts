import {
  type Database,
  JournalEntryLineSchema,
  JournalEntrySchema,
} from "@yuuka/db";
import type { Kysely } from "kysely";
import * as R from "remeda";
import { JournalEntryLine } from "../index.js";
import { AccountCode } from "../masterdata/types.js";

const load = async (
  db: Kysely<Database>,
  permission: { userId: number },
  code: number,
  range: { start: string; end: string },
) => {
  const tagCode = AccountCode.toTag(code);
  const isTag = tagCode * 1000 === code;

  const load_plain = async () => {
    return await db
      .selectFrom(JournalEntryLineSchema.name)
      .selectAll()
      .where("userId", "=", permission.userId)
      .where("code", "=", code)
      .execute();
  };

  const load_group = async () => {
    return await db
      .selectFrom(JournalEntryLineSchema.name)
      .selectAll()
      .where("userId", "=", permission.userId)
      .where("code", ">=", tagCode * 1000)
      .where("code", "<", (tagCode + 1) * 1000)
      .execute();
  };

  const lines = isTag ? await load_group() : await load_plain();
  if (lines.length <= 0) {
    return [];
  }

  const entryLineMap = new Map(
    lines.map((line) => {
      const next = R.pipe(
        line,
        JournalEntryLine.fromRow,
        JournalEntryLine.cast,
      );
      return [line.entryId, next];
    }),
  );

  // 날짜순으로 정렬된 journal entry로 보고싶다
  const rows = await db
    .selectFrom(JournalEntrySchema.name)
    .selectAll()
    .where("userId", "=", permission.userId)
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
