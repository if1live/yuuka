import type { Insertable, Kysely, Selectable, Updateable } from "kysely";
import type { SnakeCase } from "type-fest";

const kyselyName = "accountStatement";
const nativeName: SnakeCase<typeof kyselyName> = "account_statement";
export const name = kyselyName;

export interface Table {
  code: number;

  /** "2024-03-01"은 3월 1일 시작시점의 잔액 */
  date: string;
  closingBalance: number;
  totalCredit: number;
  totalDebit: number;
}

export const createSchema = async <T>(db: Kysely<T>) => {
  await db.schema
    .createTable(nativeName)
    .addColumn("code", "integer")
    .addColumn("date", "varchar(191)")
    .addColumn("closing_balance", "integer")
    .addColumn("total_credit", "integer")
    .addColumn("total_debit", "integer")
    .addPrimaryKeyConstraint("primary_key", ["code", "date"])
    .execute();
};

export const primaryKeyFields = ["code", "date"] as const;
export type PrimaryKey = Pick<Table, (typeof primaryKeyFields)[number]>;

export type Row = Selectable<Table>;
export type NewRow = Insertable<Table>;
export type RowUpdate = Updateable<Table>;