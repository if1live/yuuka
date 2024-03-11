import {
  AccountCodeSchema,
  JournalEntryLineSchema,
  JournalEntrySchema,
} from "@yuuka/db";
import type { Database } from "@yuuka/db";
import {
  CamelCasePlugin,
  Kysely,
  PostgresDialect,
  SqliteDialect,
} from "kysely";
import type { Dialect } from "kysely";
import { default as Postgres } from "pg";
import { journalContext } from "./instances.js";
import { MasterData } from "./masterdata/instances.js";
import { settings } from "./settings.js";

const createSqliteDialect = async (filename: string) => {
  const { default: SQLite } = await import("better-sqlite3");
  const database = new SQLite(filename);
  const dialect = new SqliteDialect({
    database: database,
  });
  return {
    dialect,
    // 타입 정보가 붙은 상태로 리턴하면 컴파일 에러가 나서 우회
    // 어차피 sqlite 원본을 직접 쓸 일은 자주 없을테니까
    database: database as unknown,
  };
};

const createPostgresDialect = (databaseUrl: string) => {
  const pool = new Postgres.Pool({
    connectionString: databaseUrl,
  });

  const dialect = new PostgresDialect({
    pool,
  });

  return {
    dialect,
    pool,
  };
};

// TODO: 로컬에서 in-memory sqlite 사용하는게 없어져야 교체할 수 있음
const createDialect = async (url: string): Promise<{ dialect: Dialect }> => {
  if (url.startsWith("postgres://")) {
    return createPostgresDialect(url);
  }

  return await createSqliteDialect(url);
};

export const createKysely = (dialect: Dialect) => {
  return new Kysely<Database>({
    dialect,
    plugins: [new CamelCasePlugin()],
  });
};

const { dialect } = await createDialect(settings.databaseUrl);
export const db = createKysely(dialect);

// TODO: 테이블 규격 관리 어디서 하지?
type PrepareFn = (db: Kysely<Database>) => Promise<void>;

const parepare_accountCode: PrepareFn = async (db) => {
  await db.schema
    .createTable(AccountCodeSchema.name)
    .addColumn("code", "integer", (c) => c.primaryKey())
    .addColumn("name", "varchar(255)")
    .addColumn("description", "varchar(255)")
    .execute();
};

const parepare_journalEntry: PrepareFn = async (db) => {
  await db.schema
    .createTable(JournalEntrySchema.name)
    .addColumn("id", "varchar(255)", (c) => c.primaryKey())
    .addColumn("date", "varchar(255)")
    .addColumn("brief", "varchar(255)")
    .execute();
};

const parepare_journalEntryLine: PrepareFn = async (db) => {
  await db.schema
    .createTable(JournalEntryLineSchema.name)
    .addColumn("entry_id", "varchar(255)")
    .addColumn("code", "integer")
    .addColumn("debit", "integer")
    .addColumn("credit", "integer")
    .execute();

  await db.schema
    .createIndex("idx_journalEntryLine_entry")
    .on("journalEntryLine")
    .columns(["entry_id", "code"])
    .unique()
    .execute();
};

// 스키마 구성은 유닛테스트 같은 목적으로도 쓸수 있을듯?
export const prepareSchema = async (db: Kysely<Database>) => {
  await parepare_accountCode(db);
  await parepare_journalEntry(db);
  await parepare_journalEntryLine(db);
};

// 데이터를 다양한 방식으로 뒤지려면 db에 채워놓는게 나을듯
const insertBulk_accountCode = async (db: Kysely<Database>) => {
  const items = MasterData.accountCodes.map((x): AccountCodeSchema.NewRow => {
    return {
      code: x.code,
      name: x.name,
      description: x.description,
    };
  });

  await db.insertInto(AccountCodeSchema.name).values(items).execute();
};

const insertBulk_journalEntry = async (db: Kysely<Database>) => {
  const items = journalContext.entries.map(
    (journal): JournalEntrySchema.NewRow => {
      return {
        id: journal.id,
        date: journal.date,
        brief: journal.brief,
      };
    },
  );
  await db.insertInto(JournalEntrySchema.name).values(items).execute();
};

const insertBulk_journalEntryLine = async (db: Kysely<Database>) => {
  const items = journalContext.entries.flatMap((journal) => {
    const lines = journal.lines.map((line): JournalEntryLineSchema.NewRow => {
      const debit = line._tag === "debit" ? line.debit : 0;
      const credit = line._tag === "credit" ? line.credit : 0;

      return {
        entryId: journal.id,
        code: line.code,
        debit,
        credit,
      };
    });
    return lines;
  });

  await db.insertInto(JournalEntryLineSchema.name).values(items).execute();
};

export const insertBulk = async (db: Kysely<Database>) => {
  await insertBulk_accountCode(db);
  await insertBulk_journalEntry(db);
  await insertBulk_journalEntryLine(db);
};
