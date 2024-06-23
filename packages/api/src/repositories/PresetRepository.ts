import type { Preset } from "../ledgers/index.js";
import type { MyKysely } from "../rdbms/types.js";
import { PresetTable } from "../tables/index.js";

export const loadAll = async (db: MyKysely, userId: string) => {
  const rows_preset = await db
    .selectFrom(PresetTable.name)
    .selectAll()
    .where("userId", "=", userId)
    .execute();

  const presets = rows_preset.map((row): Preset => {
    return {
      brief: row.brief,
      name: row.name,
      lines_credit: row.lines_credit,
      lines_debit: row.lines_debit,
    };
  });
  return presets;
};
