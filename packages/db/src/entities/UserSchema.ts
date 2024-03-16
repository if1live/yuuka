import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import type { PascalCase, SnakeCase } from "type-fest";
import type { MyEntitySchemaOptions } from "../types.js";
import {
  convertTypeormSchemaColumnOptions,
  defineColumn,
} from "../utils/index.js";

const kyselyName = "user";
const nativeName: SnakeCase<typeof kyselyName> = "user";
const typeormName: PascalCase<typeof kyselyName> = "User";
export const name = kyselyName;

const createColumnList = () => {
  const id = defineColumn({
    name: { native: "id", kysely: "id" },
    primary: true,
    type: Number,
  });

  const supabase = defineColumn({
    name: { native: "supabase", kysely: "supabase" },
    unique: true,
    type: String,
    length: 191,
  });

  const createdAt = defineColumn({
    name: { native: "created_at", kysely: "createdAt" },
    type: Date,
    createDate: true,
  });

  const updatedAt = defineColumn({
    name: { native: "updated_at", kysely: "updatedAt" },
    type: Date,
    updateDate: true,
  });

  return [id, supabase, createdAt, updatedAt];
};

const columns = createColumnList();

// TODO: 타입 유도?
export interface Table {
  id: number;
  supabase: string;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, never>;
}

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
