import type { MyKysely } from "../../rdbms/types.js";
import { AccountTable } from "../../tables/index.js";
import { Account } from "../models/Account.js";

export const loadAll = async (db: MyKysely): Promise<Account[]> => {
  const rows = await db.selectFrom(AccountTable.name).selectAll().execute();
  return rows.map(Account.fromRow);
};
