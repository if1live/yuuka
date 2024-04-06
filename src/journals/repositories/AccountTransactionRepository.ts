import * as R from "remeda";
import type { MyKysely } from "../../rdbms/types.js";
import { AccountTransactionTable } from "../../tables/index.js";
import type { Journal } from "../models/Journal.js";
import { JournalLine } from "../models/JournalLine.js";

export const findById = async (
  db: MyKysely,
  txid: string,
): Promise<Journal> => {
  const rows = await db
    .selectFrom(AccountTransactionTable.name)
    .innerJoin("ledgerTransaction", (join) =>
      join.onRef("ledgerTransaction.txid", "=", "accountTransaction.txid"),
    )
    .selectAll()
    .where("accountTransaction.txid", "=", txid)
    .execute();

  if (rows.length <= 0) {
    throw new Error("not found");
  }

  const [first, _drop] = rows;
  if (!first) throw new Error("not found");

  const lines = rows
    .map(JournalLine.fromRow)
    .map(JournalLine.validate)
    .sort(JournalLine.compare);

  return {
    id: first.txid,
    brief: first.brief,
    date: first.date,
    lines,
  };
};

export const findByDateRange = async (
  db: MyKysely,
  range: { start: string; end: string },
): Promise<Journal[]> => {
  const rows = await db
    .selectFrom(AccountTransactionTable.name)
    .innerJoin("ledgerTransaction", (join) =>
      join.onRef("ledgerTransaction.txid", "=", "accountTransaction.txid"),
    )
    .selectAll()
    .where("accountTransaction.date", ">=", range.start)
    .where("accountTransaction.date", "<", range.end)
    .orderBy("date asc")
    .execute();

  if (rows.length === 0) {
    return [];
  }

  const group = R.groupBy(rows, (x) => x.txid);
  const tuples = Object.entries(group);

  const entries = tuples.map(([key, values]): Journal => {
    const first = values[0];
    if (!first) throw new Error("not found");

    const lines = values
      .map(JournalLine.fromRow)
      .map(JournalLine.validate)
      .sort(JournalLine.compare);

    return {
      id: key,
      brief: first.brief,
      date: first.date,
      lines,
    };
  });
  return entries;
};

export const insertBulk = async (
  db: MyKysely,
  rows: AccountTransactionTable.NewRow[],
) => {
  return await db
    .insertInto(AccountTransactionTable.name)
    .values(rows)
    .executeTakeFirstOrThrow();
};