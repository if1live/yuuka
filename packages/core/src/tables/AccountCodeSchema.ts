import type { Insertable, Kysely, Selectable, Updateable } from "kysely";
import type { SnakeCase } from "type-fest";

const kyselyName = "accountCode";
const nativeName: SnakeCase<typeof kyselyName> = "account_code";
export const name = kyselyName;

// TODO: 타입 유도? columns
export interface Table {
  code: number;
  name: string;
  description: string;
}

export const createSchema = async <T>(db: Kysely<T>) => {
  await db.schema
    .createTable(nativeName)
    .addColumn("code", "integer", (col) => col.primaryKey())
    .addColumn("name", "varchar(191)")
    .addColumn("description", "text")
    .execute();
};

// TODO: 타입 유도?
export const primaryKeyFields = ["code"] as const;
export type PrimaryKey = Pick<Table, (typeof primaryKeyFields)[number]>;

// 자주 쓰는 타입이라서 미리 정의
export type Row = Selectable<Table>;
export type NewRow = Insertable<Table>;
export type RowUpdate = Updateable<Table>;