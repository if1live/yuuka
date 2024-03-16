import { type Kysely, sql } from "kysely";
import {
  AccountCodeSchema,
  AccountTagSchema,
  JournalEntryLineSchema,
  JournalEntrySchema,
  PreferenceSchema,
  UserSchema,
} from "./entities/index.js";

export interface Database {
  [JournalEntrySchema.name]: JournalEntrySchema.Table;
  [AccountTagSchema.name]: AccountTagSchema.Table;
  [AccountCodeSchema.name]: AccountCodeSchema.Table;
  [JournalEntryLineSchema.name]: JournalEntryLineSchema.Table;
  [PreferenceSchema.name]: PreferenceSchema.Table;
  [UserSchema.name]: UserSchema.Table;
}

// sqlite를 운영의 중심으로 넣으니까 결국 테이블 생성을 손으로 관리해야한다.
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

const prepare_user = async (db: Kysely<Database>) => {
  await db.schema
    .createTable("user")
    .addColumn("id", "integer", (col) => col.primaryKey())
    .addColumn("supabase", "varchar(191)")
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();
};

const prepareSchema = async (db: Kysely<Database>) => {
  await prepare_accountTag(db);
  await prepare_accountCode(db);
  await preapre_journalEntry(db);
  await prepare_journalEntryLine(db);
  await prepare_user(db);
};

export const Database = {
  prepareSchema,
};
