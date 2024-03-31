import type { KyselyDB } from "../index.js";
import { AccountStatementSchema } from "../tables/index.js";

const insertBulk = async (
  db: KyselyDB,
  rows: AccountStatementSchema.NewRow[],
) => {
  return await db
    .insertInto(AccountStatementSchema.name)
    .values(rows)
    .executeTakeFirstOrThrow();
};

export const AccountStatementRepository = {
  insertBulk,
};
