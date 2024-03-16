import { JournalEntrySchema } from "@yuuka/db";
import type { Database } from "@yuuka/db";
import type { Kysely } from "kysely";
import * as R from "remeda";
import type { JournalEntry } from "./JournalEntry.js";
import { JournalEntryLine } from "./JournalEntryLine.js";

const findById = async (
  db: Kysely<Database>,
  permission: { userId: number },
  entryId: string,
): Promise<JournalEntry> => {
  const rows = await db
    .selectFrom(JournalEntrySchema.name)
    .innerJoin("journalEntryLine", (join) =>
      join
        .onRef("journalEntryLine.userId", "=", "journalEntry.userId")
        .onRef("journalEntryLine.entryId", "=", "journalEntry.entryId")
        .on("journalEntryLine.userId", "=", permission.userId),
    )
    .selectAll()
    .where("journalEntry.entryId", "=", entryId)
    .execute();

  if (rows.length <= 0) {
    throw new Error("not found");
  }

  const [first, _drop] = rows;
  if (!first) throw new Error("not found");

  const lines = rows
    .map(JournalEntryLine.fromRow)
    .map(JournalEntryLine.validate)
    .sort(JournalEntryLine.compare);

  return {
    id: first.entryId,
    brief: first.brief,
    date: first.date,
    lines,
  };
};

const findByDateRange = async (
  db: Kysely<Database>,
  permission: { userId: number },
  range: { start: string; end: string },
): Promise<JournalEntry[]> => {
  const rows = await db
    .selectFrom(JournalEntrySchema.name)
    .innerJoin("journalEntryLine", (join) =>
      join
        .onRef("journalEntryLine.userId", "=", "journalEntry.userId")
        .onRef("journalEntryLine.entryId", "=", "journalEntry.entryId")
        .on("journalEntryLine.userId", "=", permission.userId),
    )
    .selectAll()
    .where("journalEntry.date", ">=", range.start)
    .where("journalEntry.date", "<", range.end)
    .execute();

  if (rows.length === 0) {
    return [];
  }

  const group = R.groupBy(rows, (x) => x.entryId);
  const tuples = Object.entries(group);

  const entries = tuples.map(([key, values]): JournalEntry => {
    const first = values[0];
    if (!first) throw new Error("not found");

    const lines = values
      .map(JournalEntryLine.fromRow)
      .map(JournalEntryLine.validate)
      .sort(JournalEntryLine.compare);

    return {
      id: key,
      brief: first.brief,
      date: first.date,
      lines,
    };
  });
  return entries;
};

export const JournalEntryRepository = {
  findById,
  findByDateRange,
};
