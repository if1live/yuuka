import { type Kysely, sql } from "kysely";
import {
  AccountCodeSchema,
  AccountTagSchema,
  JournalEntryLineSchema,
  JournalEntrySchema,
  PreferenceSchema,
} from "./entities/index.js";

export interface Database {
  [JournalEntrySchema.name]: JournalEntrySchema.Table;
  [AccountTagSchema.name]: AccountTagSchema.Table;
  [AccountCodeSchema.name]: AccountCodeSchema.Table;
  [JournalEntryLineSchema.name]: JournalEntryLineSchema.Table;
  [PreferenceSchema.name]: PreferenceSchema.Table;
}

// sqlite를 운영의 중심으로 넣으니까 결국 테이블 생성을 손으로 관리해야한다.
const prepare_accountTag = async (db: Kysely<Database>) => {
  await db.schema
    .createTable("account_tag")
    .addColumn("code", "integer", (col) => col.primaryKey())
    .addColumn("major", "varchar(191)")
    .addColumn("minor", "varchar(191)")
    .addColumn("name", "varchar(191)")
    .addColumn("description", "text")
    .execute();
};

const prepare_accountCode = async (db: Kysely<Database>) => {
  await db.schema
    .createTable("account_code")
    .addColumn("code", "integer", (col) => col.primaryKey())
    .addColumn("name", "varchar(191)")
    .addColumn("description", "text")
    .execute();
};

const preapre_journalEntry = async (db: Kysely<Database>) => {
  await db.schema
    .createTable("journal_entry")
    .addColumn("entry_id", "varchar(191)", (col) => col.primaryKey())
    .addColumn("date", "varchar(15)")
    .addColumn("brief", "text")
    .execute();
};

const prepare_journalEntryLine = async (db: Kysely<Database>) => {
  await db.schema
    .createTable("journal_entry_line")
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

const prepareSchema = async (db: Kysely<Database>) => {
  await prepare_accountTag(db);
  await prepare_accountCode(db);
  await preapre_journalEntry(db);
  await prepare_journalEntryLine(db);
};

export const Database = {
  prepareSchema,
};

/** 많은곳에서 사용되는데 import 줄이고 싶어서 단축 정의 */
export type KyselyDB = Kysely<Database>;
