import { AccountCodeSchema, type Database } from "@yuuka/db";
import type { Kysely } from "kysely";
import { AccountCode } from "./types.js";

const load = async (
  db: Kysely<Database>,
  permission: { userId: number },
): Promise<AccountCode[]> => {
  const rows = await db
    .selectFrom(AccountCodeSchema.name)
    .selectAll()
    .where("userId", "=", permission.userId)
    .execute();

  return rows.map(AccountCode.fromRow);
};

export const AccountCodeRepository = {
  load,
};
