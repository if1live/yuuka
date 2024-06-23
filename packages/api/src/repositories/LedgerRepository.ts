import { assertNonEmptyArray } from "@toss/assert";
import * as R from "remeda";
import type { DateOnly } from "../core/DateOnly.js";
import type { JournalEntry } from "../ledgers/JournalEntry.js";
import type {
  JournalLine_Credit,
  JournalLine_Debit,
} from "../ledgers/JournalLine.js";
import type { MyKysely } from "../rdbms/types.js";
import { LedgerTable } from "../tables/index.js";

export const insert = async (
  db: MyKysely,
  userId: string,
  entry: JournalEntry,
) => {
  if (entry.lines_credit.length === 0) throw new Error("no credit lines");

  if (entry.lines_debit.length === 0) throw new Error("no debit lines");

  const transactionId = entry.id;
  const rows_debit = entry.lines_debit.map((line): LedgerTable.NewRow => {
    return {
      userId,
      transactionId,
      account: line.account,

      date: entry.date,
      brief: entry.brief,
      amount: line.debit,
      commodity: line.commodity,
    };
  });

  const rows_credit = entry.lines_credit.map((line): LedgerTable.NewRow => {
    return {
      userId,
      transactionId,
      account: line.account,

      date: entry.date,
      brief: entry.brief,
      amount: -line.credit,
      commodity: line.commodity,
    };
  });

  const rows = [...rows_debit, ...rows_credit];

  await db.insertInto(LedgerTable.name).values(rows).executeTakeFirstOrThrow();
  return rows;
};

export const find = async (db: MyKysely, userId: string) => {
  const rows = await db
    .selectFrom(LedgerTable.name)
    .selectAll()
    .where("userId", "=", userId)
    .execute();

  const transactionIds = R.pipe(
    rows,
    R.sortBy((x) => x.date),
    R.map((x) => x.transactionId),
    R.unique(),
  );

  const entries = transactionIds.map((transactionId) => {
    const rows_candiate = rows.filter((x) => x.transactionId === transactionId);
    assertNonEmptyArray(rows_candiate);

    const row_first = rows_candiate[0];
    const rows_debit = rows_candiate.filter((x) => x.amount > 0);
    const rows_credit = rows_candiate.filter((x) => x.amount < 0);

    const lines_debit = rows_debit.map((row): JournalLine_Debit => {
      return {
        _tag: "debit",
        account: row.account,
        debit: row.amount,
        commodity: row.commodity,
      };
    });

    const lines_credit = rows_credit.map((row): JournalLine_Credit => {
      return {
        _tag: "credit",
        account: row.account,
        credit: -row.amount,
        commodity: row.commodity,
      };
    });

    const entry: JournalEntry = {
      id: transactionId,
      date: row_first.date as DateOnly,
      brief: row_first.brief,
      lines_debit,
      lines_credit,
    };
    return entry;
  });
  return entries;
};

export const remove = async (
  db: MyKysely,
  userId: string,
  transactionId: string,
) => {
  const result = await db
    .deleteFrom(LedgerTable.name)
    .where("userId", "=", userId)
    .where("transactionId", "=", transactionId)
    .executeTakeFirstOrThrow();
  return result;
};
