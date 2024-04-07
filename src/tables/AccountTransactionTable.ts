import type { Insertable, Kysely, Selectable, Updateable } from "kysely";
import type { SnakeCase } from "type-fest";
import type { DateText } from "../core/types.js";

const kyselyName = "accountTransaction";
const nativeName: SnakeCase<typeof kyselyName> = "account_transaction";
export const name = kyselyName;

// TODO: 타입 유도? columns
export interface Table {
  txid: string;
  date: DateText;
  brief: string;
}

// TODO: 타입 유도?
export const primaryKeyFields = ["txid"] as const;
export type PrimaryKey = Pick<Table, (typeof primaryKeyFields)[number]>;

// 자주 쓰는 타입이라서 미리 정의
export type Row = Selectable<Table>;
export type NewRow = Insertable<Table>;
export type RowUpdate = Updateable<Table>;

export const createSchema = async <T>(db: Kysely<T>) => {
  await db.schema
    .createTable(nativeName)
    .addColumn("txid", "text")
    .addColumn("date", "text")
    .addColumn("brief", "text")
    .addPrimaryKeyConstraint("primary_key", [...primaryKeyFields])
    .execute();
};
