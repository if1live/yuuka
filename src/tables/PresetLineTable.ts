import type { Insertable, Kysely, Selectable, Updateable } from "kysely";
import type { SnakeCase } from "type-fest";

const kyselyName = "presetLine";
const nativeName: SnakeCase<typeof kyselyName> = "preset_line";
export const name = kyselyName;

// TODO: 타입 유도? columns
export interface Table {
  presetId: number;
  account: string;
  tag: string;
  debit: number;
  credit: number;
  commodity: string;
}

// TODO: 타입 유도?
export const primaryKeyFields = ["presetId", "account"] as const;
export type PrimaryKey = Pick<Table, (typeof primaryKeyFields)[number]>;

// 자주 쓰는 타입이라서 미리 정의
export type Row = Selectable<Table>;
export type NewRow = Insertable<Table>;
export type RowUpdate = Updateable<Table>;

export const createSchema = async <T>(db: Kysely<T>) => {
  await db.schema
    .createTable(nativeName)
    .addColumn("presetId", "integer")
    .addColumn("account", "text")
    .addColumn("tag", "text")
    .addColumn("debit", "integer")
    .addColumn("credit", "integer")
    .addColumn("commodity", "text")
    .addPrimaryKeyConstraint("primary", [...primaryKeyFields])
    .execute();
};
