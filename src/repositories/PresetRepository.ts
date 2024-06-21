import type {
  JournalLine_Credit,
  JournalLine_Debit,
} from "../ledgers/JournalLine.js";
import type { Preset } from "../ledgers/index.js";
import type { MyKysely } from "../rdbms/types.js";
import { PresetLineTable, PresetTable } from "../tables/index.js";

export const loadAll = async (db: MyKysely, userId: string) => {
  const rows_preset = await db
    .selectFrom(PresetTable.name)
    .selectAll()
    .where("userId", "=", userId)
    .execute();

  // 프리셋이 그렇게 많지 않을테니까 무식하게 구현해도 성능 문제는 없을듯
  const presetIds = rows_preset.map((row) => row.id);
  const rows_lines = await loadLines(db, presetIds);
  type LineRow = (typeof rows_lines)[number];

  const convertRow_debit = (row: LineRow): JournalLine_Debit => {
    return {
      _tag: "debit",
      account: row.account,
      debit: row.debit,
      commodity: row.commodity,
    };
  };

  const convertRow_credit = (row: LineRow): JournalLine_Credit => {
    return {
      _tag: "credit",
      account: row.account,
      credit: row.credit,
      commodity: row.commodity,
    };
  };

  const presets = rows_preset.map((row): Preset => {
    const lines = rows_lines.filter((line) => line.presetId === row.id);

    const lines_debit = lines
      .filter((line) => line.tag === "debit")
      .map(convertRow_debit);

    const lines_credit = lines
      .filter((line) => line.tag === "credit")
      .map(convertRow_credit);

    return {
      brief: row.brief,
      name: row.name,
      lines_credit,
      lines_debit,
    };
  });
  return presets;
};

const loadLines = async (db: MyKysely, ids: number[]) => {
  if (ids.length === 0) {
    return [];
  }

  const rows = await db
    .selectFrom(PresetLineTable.name)
    .selectAll()
    .where("presetId", "in", ids)
    .execute();
  return rows;
};
