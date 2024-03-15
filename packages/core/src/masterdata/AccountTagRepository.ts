import { AccountTagSchema, type Database } from "@yuuka/db";
import type { Kysely } from "kysely";
import { AccountTag } from "./types.js";

const load = async (
  db: Kysely<Database>,
  permission: { userId: number },
): Promise<AccountTag[]> => {
  const rows = await db
    .selectFrom(AccountTagSchema.name)
    .selectAll()
    .where("userId", "=", permission.userId)
    .execute();

  return rows.map(AccountTag.fromRow);
};

export const AccountTagRepository = {
  load,
};
