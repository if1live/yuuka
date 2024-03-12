import type { Insertable, Selectable, Updateable } from "kysely";
import type { PascalCase, SnakeCase } from "type-fest";
import type { MyEntitySchemaOptions } from "../types.js";
import {
  convertTypeormSchemaColumnOptions,
  defineColumn,
} from "../utils/index.js";

const kyselyName = "preference";
const nativeName: SnakeCase<typeof kyselyName> = "preference";
const typeormName: PascalCase<typeof kyselyName> = "Preference";
export const name = kyselyName;

const createColumnList = () => {
  const key = defineColumn({
    name: { native: "key", kysely: "key" },
    primary: true,
    type: String,
    length: 191,
  });

  const value = defineColumn({
    name: { native: "value", kysely: "value" },
    type: "text",
  });

  return [key, value];
};

const columns = createColumnList();

// TODO: 타입 유도?
export interface Table {
  key: string;
  value: string;
}

export const primaryKeyFields = ["key"] as const;
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
