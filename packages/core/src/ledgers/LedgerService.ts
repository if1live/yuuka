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

  const entryIds = lines.map((line) => line.entryId);
  const rows = await db
    .selectFrom(JournalEntrySchema.name)
    .selectAll()
    .where("userId", "=", permission.userId)
    .where("entryId", "in", entryIds)
    .where("date", ">=", range.start)
    .where("date", "<", range.end)
    .execute();
  const entryMap = new Map(rows.map((row) => [row.entryId, row]));

  const ledgers = lines.map((line) => {
    const entry = entryMap.get(line.entryId);
    const entryLine = R.pipe(
      line,
      JournalEntryLine.fromRow,
      JournalEntryLine.cast,
    );

    return {
      id: line.entryId,
      brief: entry?.brief ?? "<unknwon>",
      date: entry?.date ?? "1970-01-01",
      debit: entryLine._tag === "debit" ? entryLine.debit : 0,
      credit: entryLine._tag === "credit" ? entryLine.credit : 0,
    };
  });
  return ledgers;
};

export const LedgerService = {
  load,
};
