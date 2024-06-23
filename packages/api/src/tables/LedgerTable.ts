import type {
  Generated,
  Insertable,
  Kysely,
  Selectable,
  Updateable,
} from "kysely";
import type { SnakeCase } from "type-fest";

const kyselyName = "ledger";
const nativeName: SnakeCase<typeof kyselyName> = "ledger";
export const name = kyselyName;

// 테이블 설계는 좀 무식해도 되지 않을까?
// 어차피 임시 저장용이라서
export interface Table {
  userId: string;
  transactionId: string;
  account: string;

  date: string;
  brief: string;
  amount: number;
  commodity: string;
}

export const primaryKeyFields = ["userId", "transactionId", "account"] as const;
export type PrimaryKey = Pick<Table, (typeof primaryKeyFields)[number]>;

export type Row = Selectable<Table>;
export type NewRow = Insertable<Table>;
export type RowUpdate = Updateable<Table>;

export const defineSchema_sqlite = <T>(db: Kysely<T>) => {
  return db.schema
    .createTable(nativeName)
    .addColumn("userId", "text")
    .addColumn("transactionId", "text")
    .addColumn("account", "text")
    .addColumn("date", "text")
    .addColumn("brief", "text")
    .addColumn("amount", "integer")
    .addColumn("commodity", "text")
    .addPrimaryKeyConstraint("primary", [...primaryKeyFields]);
};

export const defineSchema_pg = <T>(db: Kysely<T>) => {
  const prefix = nativeName;
  return db.schema
    .createTable(nativeName)
    .addColumn("userId", "text")
    .addColumn("transactionId", "text")
    .addColumn("account", "text")
    .addColumn("date", "text")
    .addColumn("brief", "text")
    .addColumn("amount", "integer")
    .addColumn("commodity", "text")
    .addPrimaryKeyConstraint(`${prefix}_primary`, [...primaryKeyFields]);
};
