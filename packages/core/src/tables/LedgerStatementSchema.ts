import type { Insertable, Kysely, Selectable, Updateable } from "kysely";
import type { SnakeCase } from "type-fest";

const kyselyName = "ledgerStatement";
const nativeName: SnakeCase<typeof kyselyName> = "ledger_statement";
export const name = kyselyName;

export interface Table {
  code: number;
  date: string;
  closingBalance: number;
}

export const createSchema = async <T>(db: Kysely<T>) => {
  await db.schema
    .createTable(nativeName)
    .addColumn("code", "integer")
    .addColumn("date", "varchar(191)")
    .addColumn("closing_balance", "integer")
    .addPrimaryKeyConstraint("primary_key", ["code", "date"])
    .execute();
};

export const primaryKeyFields = ["code", "date"] as const;
export type PrimaryKey = Pick<Table, (typeof primaryKeyFields)[number]>;

export type Row = Selectable<Table>;
export type NewRow = Insertable<Table>;
export type RowUpdate = Updateable<Table>;
