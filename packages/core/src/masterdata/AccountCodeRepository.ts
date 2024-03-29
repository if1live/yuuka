import { AccountCodeSchema, type KyselyDB } from "@yuuka/db";
import { AccountCode } from "./types.js";

const load = async (db: KyselyDB): Promise<AccountCode[]> => {
  const rows = await db
    .selectFrom(AccountCodeSchema.name)
    .selectAll()
    .execute();

  return rows.map(AccountCode.fromRow);
};

export const AccountCodeRepository = {
  load,
};
