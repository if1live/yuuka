import type { Insertable, Selectable, Updateable } from "kysely";
import type { PascalCase, SnakeCase } from "type-fest";
import type { MyEntitySchemaOptions } from "../types.js";
import {
  convertTypeormSchemaColumnOptions,
  defineColumn,
} from "../utils/index.js";

const kyselyName = "accountCode";
const nativeName: SnakeCase<typeof kyselyName> = "account_code";
const typeormName: PascalCase<typeof kyselyName> = "AccountCode";
export const name = kyselyName;

const createColumnList = () => {
  const code = defineColumn({
    name: { native: "code", kysely: "code" },
    primary: true,
    type: "int",
  });

  const name = defineColumn({
    name: { native: "name", kysely: "name" },
    type: String,
    length: 191,
  });

  const description = defineColumn({
    name: { native: "description", kysely: "description" },
    type: "text",
  });

  return [code, name, description];
};

const columns = createColumnList();

// TODO: 타입 유도? columns
export interface Table {
  code: number;
  name: string;
  description: string;
}

// TODO: 타입 유도?
export const primaryKeyFields = ["code"] as const;
export type PrimaryKey = Pick<Table, (typeof primaryKeyFields)[number]>;

// 자주 쓰는 타입이라서 미리 정의
export type Row = Selectable<Table>;
export type NewRow = Insertable<Table>;
export type RowUpdate = Updateable<Table>;

export const entityOptions: MyEntitySchemaOptions = {
  name: {
    kysely: kyselyName,
    native: nativeName,
    typeorm: typeormName,
  },
  columns: Object.fromEntries(columns.map(convertTypeormSchemaColumnOptions)),
};
