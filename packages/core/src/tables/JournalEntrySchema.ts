import type { Insertable, Kysely, Selectable, Updateable } from "kysely";
import type { SnakeCase } from "type-fest";

const kyselyName = "journalEntry";
const nativeName: SnakeCase<typeof kyselyName> = "journal_entry";
export const name = kyselyName;

// TODO: 타입 유도? columns
export interface Table {
  entryId: string;
  date: string;
  brief: string;
}

export const createSchema = async <T>(db: Kysely<T>) => {
  await db.schema
    .createTable(nativeName)
    .addColumn("entry_id", "varchar(191)", (col) => col.primaryKey())
    .addColumn("date", "varchar(15)")
    .addColumn("brief", "text")
    .execute();
};

// TODO: 타입 유도?
export const primaryKeyFields = ["entryId"] as const;
export type PrimaryKey = Pick<Table, (typeof primaryKeyFields)[number]>;

// 자주 쓰는 타입이라서 미리 정의
export type Row = Selectable<Table>;
export type NewRow = Insertable<Table>;
export type RowUpdate = Updateable<Table>;
