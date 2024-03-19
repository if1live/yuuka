import { AccountTagSchema, type Database } from "@yuuka/db";
import type { Kysely } from "kysely";
import { AccountTag } from "./types.js";

const load = async (db: Kysely<Database>): Promise<AccountTag[]> => {
  const rows = await db.selectFrom(AccountTagSchema.name).selectAll().execute();

  return rows.map(AccountTag.fromRow);
};

export const AccountTagRepository = {
  load,
};
