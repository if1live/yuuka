import assert from "node:assert";
import { JournalEntrySchema } from "@yuuka/db";
import type { Database } from "@yuuka/db";
import type { Kysely } from "kysely";
import * as R from "remeda";
import type { JournalEntry } from "./JournalEntry.js";
import { JournalEntryLine } from "./JournalEntryLine.js";

const findById = async (
  db: Kysely<Database>,
  id: string,
): Promise<JournalEntry> => {
  const rows = await db
    .selectFrom(JournalEntrySchema.name)
    .innerJoin(
      "journalEntryLine",
      "journalEntryLine.entryId",
      "journalEntry.id",
    )
    .selectAll()
    .where("id", "=", id)
    .execute();

  if (rows.length <= 0) {
    throw new Error("not found");
  }

  const [first, _drop] = rows;
  assert.ok(first);

  const lines = rows
    .map(JournalEntryLine.validate)
    .sort(JournalEntryLine.compare);

  return {
    id: first.id,
    brief: first.brief,
    date: first.date,
    lines,
  };
};

const findByDateRange = async (
  db: Kysely<Database>,
  startDate: string,
  endDate: string,
): Promise<JournalEntry[]> => {
  const rows = await db
    .selectFrom(JournalEntrySchema.name)
    .innerJoin(
      "journalEntryLine",
      "journalEntryLine.entryId",
      "journalEntry.id",
    )
    .selectAll()
    .where("date", ">=", startDate)
    .where("date", "<", endDate)
    .execute();

  if (rows.length === 0) {
    return [];
  }

  const group = R.groupBy(rows, (x) => x.entryId);
  const tuples = Object.entries(group);

  const entries = tuples.map(([key, values]): JournalEntry => {
    const first = values[0];
    assert.ok(first);

    const lines = values
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
