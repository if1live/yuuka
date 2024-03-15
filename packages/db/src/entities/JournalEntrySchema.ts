import type { Insertable, Selectable, Updateable } from "kysely";
import type { PascalCase, SnakeCase } from "type-fest";
import type { MyEntitySchemaOptions } from "../types.js";
import {
  convertTypeormSchemaColumnOptions,
  defineColumn,
} from "../utils/index.js";

const kyselyName = "journalEntry";
const nativeName: SnakeCase<typeof kyselyName> = "journal_entry";
const typeormName: PascalCase<typeof kyselyName> = "JournalEntry";
export const name = kyselyName;

const createColumnList = () => {
  const userId = defineColumn({
    name: { native: "user_id", kysely: "userId" },
    primary: true,
    type: Number,
  });

  const entryId = defineColumn({
    name: { native: "entry_id", kysely: "entryId" },
    primary: true,
    type: String,
    length: 191,
  });

  // TODO: date를 문자열로 관리하는건 좀 멍청하지만
  // 2024-01-02 로 당장은 충분함
  const date = defineColumn({
    name: { native: "date", kysely: "date" },
    type: String,
    length: 15,
  });

  const brief = defineColumn({
    name: { native: "brief", kysely: "brief" },
    type: "text",
  });

  return [userId, entryId, date, brief];
};

const columns = createColumnList();

// TODO: 타입 유도? columns
export interface Table {
  userId: number;
  entryId: string;
  date: string;
  brief: string;
}

// TODO: 타입 유도?
export const primaryKeyFields = ["userId", "entryId"] as const;
export type PrimaryKey = Pick<Table, (typeof primaryKeyFields)[number]>;

// 자주 쓰는 타입이라서 미리 정의
export type Row = Selectable<Table>;
export type NewRow = Insertable<Table>;
export type RowUpdate = Updateable<Table>;

export const options: MyEntitySchemaOptions = {
  name: {
    kysely: kyselyName,
    native: nativeName,
    typeorm: typeormName,
  },
  columns: Object.fromEntries(columns.map(convertTypeormSchemaColumnOptions)),
};
