import type { MyKysely } from "../../rdbms/types.js";
import { LedgerStatementTable } from "../../tables/index.js";

export const insertBulk = async (
  db: MyKysely,
  rows: LedgerStatementTable.NewRow[],
) => {
  return await db
    .insertInto(LedgerStatementTable.name)
    .values(rows)
    .executeTakeFirstOrThrow();
};
