import * as R from "remeda";
import { AccountTransactionSchema } from "../../tables/index.js";
import type { KyselyDB } from "../../tables/index.js";
import type { JournalEntry } from "../models/JournalEntry.js";
import { JournalEntryLine } from "../models/JournalEntryLine.js";

const findById = async (
  db: KyselyDB,
  entryId: string,
): Promise<JournalEntry> => {
  db.transaction().execute(async (trx) => {});
  const rows = await db
    .selectFrom(AccountTransactionSchema.name)
    .innerJoin("ledgerTransaction", (join) =>
      join.onRef(
        "ledgerTransaction.entryId",
        "=",
        "accountTransaction.entryId",
      ),
    )
    .selectAll()
    .where("accountTransaction.entryId", "=", entryId)
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
  db: KyselyDB,
  range: { start: string; end: string },
): Promise<JournalEntry[]> => {
  const rows = await db
    .selectFrom(AccountTransactionSchema.name)
    .innerJoin("ledgerTransaction", (join) =>
      join.onRef(
        "ledgerTransaction.entryId",
        "=",
        "accountTransaction.entryId",
      ),
    )
    .selectAll()
    .where("accountTransaction.date", ">=", range.start)
    .where("accountTransaction.date", "<", range.end)
    .orderBy("date asc")
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

const insertBulk = async (
  db: KyselyDB,
  rows: AccountTransactionSchema.NewRow[],
) => {
  return await db
    .insertInto(AccountTransactionSchema.name)
    .values(rows)
    .executeTakeFirstOrThrow();
};

export const AccountTransactionRepository = {
  findById,
  findByDateRange,
  insertBulk,
};
