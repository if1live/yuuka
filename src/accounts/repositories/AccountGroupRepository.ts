import type { MyKysely } from "../../rdbms/types.js";
import { AccountGroupTable } from "../../tables/index.js";
import { AccountGroup } from "../models/AccountGroup.js";

export const loadAll = async (db: MyKysely): Promise<AccountGroup[]> => {
  const rows = await db
    .selectFrom(AccountGroupTable.name)
    .selectAll()
    .execute();

  return rows.map(AccountGroup.fromRow);
};
