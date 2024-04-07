import type { DateText } from "../../core/types.js";
import type { MyKysely } from "../../rdbms/types.js";
import { AccountStatementTable } from "../../tables/index.js";

export const insertBulk = async (
  db: MyKysely,
  rows: AccountStatementTable.NewRow[],
) => {
  return await db
    .insertInto(AccountStatementTable.name)
    .values(rows)
    .executeTakeFirstOrThrow();
};

export const loadByCodeAndDate = async (
  db: MyKysely,
  code: number,
  date: DateText,
) => {
  const found = await db
    .selectFrom(AccountStatementTable.name)
    .selectAll()
    .where("code", "=", code)
    .where("date", "=", date)
    .executeTakeFirst();
  return found;
};

export const loadByDate = async (db: MyKysely, date: DateText) => {
  const founds = await db
    .selectFrom(AccountStatementTable.name)
    .selectAll()
    .where("date", "=", date)
    .execute();
  return founds;
};
