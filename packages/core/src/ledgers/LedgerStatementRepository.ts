import type { KyselyDB } from "../index.js";
import { LedgerStatementSchema } from "../tables/index.js";

const insertBulk = async (
  db: KyselyDB,
  rows: LedgerStatementSchema.NewRow[],
) => {
  return await db
    .insertInto(LedgerStatementSchema.name)
    .values(rows)
    .executeTakeFirstOrThrow();
};

export const LedgerStatementRepository = {
  insertBulk,
};
