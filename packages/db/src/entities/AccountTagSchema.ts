import type { Insertable, Selectable, Updateable } from "kysely";
import type { PascalCase, SnakeCase } from "type-fest";
import type { MyEntitySchemaOptions } from "../types.js";
import {
  convertTypeormSchemaColumnOptions,
  defineColumn,
} from "../utils/index.js";

const kyselyName = "accountTag";
const nativeName: SnakeCase<typeof kyselyName> = "account_tag";
const typeormName: PascalCase<typeof kyselyName> = "AccountTag";
export const name = kyselyName;

const createColumnList = () => {
  const code = defineColumn({
    name: { native: "code", kysely: "code" },
    type: "int",
    primary: true,
  });

  const major = defineColumn({
    name: { native: "major", kysely: "major" },
    type: String,
    length: 191,
  });

  const minor = defineColumn({
    name: { native: "minor", kysely: "minor" },
    type: String,
    length: 191,
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

  return [code, major, minor, name, description];
};

const columns = createColumnList();

export interface Table {
  code: number;
  major: "asset" | "liability" | "equity" | "revenue" | "expense";
  minor: string;
  name: string;
  description: string;
}

export const primaryKeyFields = ["code"] as const;
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
