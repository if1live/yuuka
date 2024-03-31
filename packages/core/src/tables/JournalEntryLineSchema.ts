import type { Insertable, Kysely, Selectable, Updateable } from "kysely";
import type { SnakeCase } from "type-fest";

const kyselyName = "journalEntryLine";
const nativeName: SnakeCase<typeof kyselyName> = "journal_entry_line";
export const name = kyselyName;

// debit, credit을 rdbms enum 없으 타입스크립트 수준에서 구분하고 싶다.
// 둘을 묶어서 부를 이름은 생각나지 않았다
export const debitTag = 1;
export const creditTag = 2;

export type DebitTag = typeof debitTag;
export type CreditTag = typeof creditTag;

// TODO: 타입 유도? columns
export interface Table {
  entryId: string;
  code: number;
  tag: DebitTag | CreditTag;
  amount: number;
}

export const createSchema = async <T>(db: Kysely<T>) => {
  await db.schema
    .createTable(nativeName)
    .addColumn("entry_id", "varchar(191)")
    .addColumn("code", "integer")
    .addColumn("tag", "integer")
    .addColumn("amount", "integer")
    .addPrimaryKeyConstraint("primary_key", ["entry_id", "code"])
    .execute();

  /*
    TODO: sql__js.js?v=5b382feb:469 Uncaught (in promise) Error: near "(": syntax error
    ???
  await db.schema
    .createIndex("journal_entry_line_code_date")
    .columns(["code", "date"])
    .execute();

  await db.schema
    .createIndex("journal_entry_line_date")
    .columns(["date"])
    .execute();
    */
};

// TODO: 타입 유도?
export const primaryKeyFields = ["entryId", "code"] as const;
export type PrimaryKey = Pick<Table, (typeof primaryKeyFields)[number]>;

// 자주 쓰는 타입이라서 미리 정의
export type Row = Selectable<Table>;
export type NewRow = Insertable<Table>;
export type RowUpdate = Updateable<Table>;
