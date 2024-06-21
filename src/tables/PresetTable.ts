import type { Insertable, Kysely, Selectable, Updateable } from "kysely";
import type { SnakeCase } from "type-fest";

const kyselyName = "preset";
const nativeName: SnakeCase<typeof kyselyName> = "preset";
export const name = kyselyName;

// TODO: 타입 유도? columns
export interface Table {
  id: number;
  userId: string;
  name: string;
  brief: string;
}

// TODO: 타입 유도?
export const primaryKeyFields = ["id"] as const;
export type PrimaryKey = Pick<Table, (typeof primaryKeyFields)[number]>;

// 자주 쓰는 타입이라서 미리 정의
export type Row = Selectable<Table>;
export type NewRow = Insertable<Table>;
export type RowUpdate = Updateable<Table>;

export const createSchema = async <T>(db: Kysely<T>) => {
  await db.schema
    .createTable(nativeName)
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("userId", "text")
    .addColumn("name", "text")
    .addColumn("brief", "text")
    .addPrimaryKeyConstraint("primary", [...primaryKeyFields])
    .addUniqueConstraint("userId_name", ["userId", "name"])
    .execute();
};
