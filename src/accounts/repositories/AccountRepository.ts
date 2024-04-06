import type { MyKysely } from "../../rdbms/types.js";
import { AccountTable } from "../../tables/index.js";
import { AccountCode } from "../models/AccountCode.js";

export const loadAll = async (db: MyKysely): Promise<AccountCode[]> => {
  const rows = await db.selectFrom(AccountTable.name).selectAll().execute();
  return rows.map(AccountCode.fromRow);
};
