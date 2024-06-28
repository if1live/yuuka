import type { Account } from "../ledgers/Account.js";
import type { MyKysely } from "../rdbms/types.js";
import { AccountTable } from "../tables/index.js";

export const loadAll = async (
  db: MyKysely,
  userId: string,
): Promise<Account[]> => {
  const rows = await db
    .selectFrom(AccountTable.name)
    .selectAll()
    .where("userId", "=", userId)
    .orderBy("sortKey")
    .execute();

  const results = rows.map((row): Account => {
    return {
      name: row.name,
      description: row.description,
      sortKey: row.sortKey,
    };
  });

  return results;
};
