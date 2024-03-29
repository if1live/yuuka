import { AccountTagSchema, type KyselyDB } from "@yuuka/db";
import { AccountTag } from "./types.js";

const load = async (db: KyselyDB): Promise<AccountTag[]> => {
  const rows = await db.selectFrom(AccountTagSchema.name).selectAll().execute();

  return rows.map(AccountTag.fromRow);
};

export const AccountTagRepository = {
  load,
};
