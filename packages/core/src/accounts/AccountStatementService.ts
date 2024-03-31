import type { KyselyDB } from "../index.js";
import { AccountStatementSchema } from "../tables/index.js";

const loadByPrimaryKey = async (db: KyselyDB, code: number, date: string) => {
  const found = await db
    .selectFrom(AccountStatementSchema.name)
    .selectAll()
    .where("code", "=", code)
    .where("date", "=", date)
    .executeTakeFirst();
  return found;
};

const loadByDate = async (db: KyselyDB, date: string) => {
  const founds = await db
    .selectFrom(AccountStatementSchema.name)
    .selectAll()
    .where("date", "=", date)
    .execute();
  return founds;
};

export const AccountStatementService = {
  loadByPrimaryKey,
  loadByDate,
};
