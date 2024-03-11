import type { Insertable, Selectable, Updateable } from "kysely";
import type { PascalCase, SnakeCase } from "type-fest";
import type { MyEntitySchemaOptions } from "../types.js";
import {
  convertTypeormSchemaColumnOptions,
  defineColumn,
} from "../utils/index.js";

const kyselyName = "journalEntryLine";
const nativeName: SnakeCase<typeof kyselyName> = "journal_entry_line";
const typeormName: PascalCase<typeof kyselyName> = "JournalEntryLine";
export const name = kyselyName;

const createColumnList = () => {
  const entryId = defineColumn({
    name: { native: "entry_id", kysely: "entryId" },
    primary: true,
    type: String,
    length: 191,
  });

  const code = defineColumn({
    name: { native: "code", kysely: "code" },
    type: "int",
  });

  // TODO: decimal을 int로 바꿀 가능성 있음
  // KRW만 쓰면 소수점 없어도 되는데 USD도 지원하고 싶다.
  const debit = defineColumn({
    name: { native: "debit", kysely: "debit" },
    type: "decimal",
    precision: 10,
    scale: 2,
  });

  const credit = defineColumn({
    name: { native: "credit", kysely: "credit" },
    type: "decimal",
    precision: 10,
    scale: 2,
  });

  return [entryId, code, debit, credit];
};

const columns = createColumnList();

// TODO: 타입 유도? columns
export interface Table {
  entryId: string;
  code: number;
  debit: number;
  credit: number;
}

// TODO: 타입 유도?
export const primaryKeyFields = ["entryId", "code"] as const;
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