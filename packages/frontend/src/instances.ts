import type { Database } from "@yuuka/db";
import { CamelCasePlugin, Kysely } from "kysely";
import { SqlJsDialect } from "kysely-wasm";
import initSqlJs from "sql.js";

// https://sql.js.org/#/?id=usage
// https://stackoverflow.com/a/75806317
// TODO: 더 멀쩡한 방법 찾아서 교체하기
const sqlJs = await initSqlJs({
  locateFile: (file) => `https://sql.js.org/dist/${file}`,
});
const database = new sqlJs.Database();
const dialect = new SqlJsDialect({
  database,
});
export const db = new Kysely<Database>({
  dialect,
  plugins: [new CamelCasePlugin()],
  // log: ["error", "query"],
});

// TODO: 테이블 초기화 쿼리를 어디에서 가져오지?
const prepare_accountTag = async (db: Kysely<Database>) => {
  await db.schema
    .createTable("account_tag")
    .addColumn("user_id", "integer")
    .addColumn("code", "integer")
    .addColumn("major", "varchar(191)")
    .addColumn("minor", "varchar(191)")
    .addColumn("name", "varchar(191)")
    .addColumn("description", "text")
    .addPrimaryKeyConstraint("primary_key", ["user_id", "code"])
    .execute();
};

const prepare_accountCode = async (db: Kysely<Database>) => {
  await db.schema
    .createTable("account_code")
    .addColumn("user_id", "integer")
    .addColumn("code", "integer")
    .addColumn("name", "varchar(191)")
    .addColumn("description", "text")
    .addPrimaryKeyConstraint("primary_key", ["user_id", "code"])
    .execute();
};

const preapre_journalEntry = async (db: Kysely<Database>) => {
  await db.schema
    .createTable("journal_entry")
    .addColumn("user_id", "integer")
    .addColumn("entry_id", "varchar(191)")
    .addColumn("date", "varchar(15)")
    .addColumn("brief", "text")
    .addPrimaryKeyConstraint("primary_key", ["user_id", "entry_id"])
    .execute();
};

const prepare_journalEntryLine = async (db: Kysely<Database>) => {
  await db.schema
    .createTable("journal_entry_line")
    .addColumn("user_id", "integer")
    .addColumn("entry_id", "varchar(191)")
    .addColumn("code", "integer")
    .addColumn("tag", "integer")
    .addColumn("amount", "integer")
    .addPrimaryKeyConstraint("primary_key", ["user_id", "entry_id", "code"])
    .execute();
};

await prepare_accountTag(db);
await prepare_accountCode(db);
await preapre_journalEntry(db);
await prepare_journalEntryLine(db);
