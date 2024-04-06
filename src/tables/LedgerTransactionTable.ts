import type { Insertable, Kysely, Selectable, Updateable } from "kysely";
import type { SnakeCase } from "type-fest";

const kyselyName = "ledgerTransaction";
const nativeName: SnakeCase<typeof kyselyName> = "ledger_transaction";
export const name = kyselyName;

// debit, credit을 rdbms enum 없으 타입스크립트 수준에서 구분하고 싶다.
// 둘을 묶어서 부를 이름은 생각나지 않았다
export const debitTag = 1;
export const creditTag = 2;

export type DebitTag = typeof debitTag;
export type CreditTag = typeof creditTag;

// TODO: 타입 유도? columns
export interface Table {
  txid: string;
  code: number;
  tag: DebitTag | CreditTag;
  amount: number;
}

// TODO: 타입 유도?
export const primaryKeyFields = ["txid", "code"] as const;
export type PrimaryKey = Pick<Table, (typeof primaryKeyFields)[number]>;

// 자주 쓰는 타입이라서 미리 정의
export type Row = Selectable<Table>;
export type NewRow = Insertable<Table>;
export type RowUpdate = Updateable<Table>;

export const createSchema = async <T>(db: Kysely<T>) => {
  await db.schema
    .createTable(nativeName)
    .addColumn("txid", "text")
    .addColumn("code", "integer")
    .addColumn("tag", "integer")
    .addColumn("amount", "integer")
    .addPrimaryKeyConstraint("primary_key", [...primaryKeyFields])
    .execute();

  // 계정 기준으로 검색
  await db.schema
    .createIndex(`${nativeName}_code_date`)
    .on(nativeName)
    .columns(["code", "date"])
    .execute();

  // 날짜 기준으로 검색할때
  await db.schema
    .createIndex(`${nativeName}_date`)
    .on(nativeName)
    .columns(["date"])
    .execute();
};
