import type {
  Generated,
  Insertable,
  Kysely,
  Selectable,
  Updateable,
} from "kysely";
import type { SnakeCase } from "type-fest";

const kyselyName = "account";
const nativeName: SnakeCase<typeof kyselyName> = "account";
export const name = kyselyName;

// TODO: 타입 유도? columns
export interface Table {
  id: Generated<number>;
  userId: string;
  name: string;
  description: string;
}

// TODO: 타입 유도?
export const primaryKeyFields = ["id"] as const;
export type PrimaryKey = Pick<Table, (typeof primaryKeyFields)[number]>;

// 자주 쓰는 타입이라서 미리 정의
export type Row = Selectable<Table>;
export type NewRow = Insertable<Table>;
export type RowUpdate = Updateable<Table>;

export const defineSchema_sqlite = <T>(db: Kysely<T>) => {
  return db.schema
    .createTable(nativeName)
    .addColumn("id", "integer")
    .addColumn("userId", "text")
    .addColumn("name", "text")
    .addColumn("description", "text")
    .addPrimaryKeyConstraint("primary", [...primaryKeyFields])
    .addUniqueConstraint("userId_name", ["userId", "name"]);
};

export const defineSchema_pg = <T>(db: Kysely<T>) => {
  const prefix = nativeName;
  return db.schema
    .createTable(nativeName)
    .addColumn("id", "serial")
    .addColumn("userId", "text")
    .addColumn("name", "text")
    .addColumn("description", "text")
    .addPrimaryKeyConstraint(`${prefix}_primary`, [...primaryKeyFields])
    .addUniqueConstraint(`${prefix}_userId_name`, ["userId", "name"]);
};
