import type { MyKysely } from "../../rdbms/types.js";
import { LedgerTransactionTable } from "../../tables/index.js";

export const insertBulk = async (
  db: MyKysely,
  rows: LedgerTransactionTable.NewRow[],
) => {
  return await db
    .insertInto(LedgerTransactionTable.name)
    .values(rows)
    .executeTakeFirstOrThrow();
};
