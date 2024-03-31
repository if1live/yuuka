import { type KyselyDB, LedgerTransactionSchema } from "../../tables/index.js";

const insertBulk = async (
  db: KyselyDB,
  rows: LedgerTransactionSchema.NewRow[],
) => {
  return await db
    .insertInto(LedgerTransactionSchema.name)
    .values(rows)
    .executeTakeFirstOrThrow();
};

export const LedgerTransactionRepository = {
  insertBulk,
};
