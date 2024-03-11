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
  const id = defineColumn({
    name: { native: "id", kysely: "id" },
    primary: true,
    type: String,
    length: 191,
  });

  const brief = defineColumn({
    name: { native: "brief", kysely: "brief" },
    type: "text",
  });

  return [id, brief];
};

const columns = createColumnList();

// TODO: 타입 유도? columns
export interface Table {
  id: string;
  date: string;
  brief: string;
}

// TODO: 타입 유도?
export const primaryKeyFields = ["id"] as const;
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
