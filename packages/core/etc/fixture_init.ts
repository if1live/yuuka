import fs from "node:fs/promises";
import path from "node:path";
import {
  AccountCodeSchema,
  AccountTagSchema,
  Database,
  JournalEntryLineSchema,
  JournalEntrySchema,
  type KyselyDB,
  UserSchema,
} from "@yuuka/db";
import { default as SQLite } from "better-sqlite3";
import {
  CamelCasePlugin,
  Kysely,
  PostgresDialect,
  SqliteDialect,
  WithSchemaPlugin,
  sql,
} from "kysely";
import { default as Postgres } from "pg";
import * as R from "remeda";
import { JournalEntryService } from "../src/journals/JournalEntryService.js";
import { AccountCodeLoader } from "../src/loaders/AccountCodeLoader.js";
import { JournalEntryLoader } from "../src/loaders/JournalEntryLoader.js";
import { settings } from "../src/settings.js";

const financialReportsDir = "personal-financial-statements";
const financialReportsPath = path.resolve(
  settings.rootPath,
  "..",
  financialReportsDir,
);

// TODO: journal은 가변데이터가 가까운데 어디에서 취급하지?
const journalPath = path.join(financialReportsPath, "journals");
const journalContext = R.pipe(
  await JournalEntryLoader.read(journalPath, "journal_2024_03.csv"),
  (x) => JournalEntryLoader.convert(x),
);

const sheetPath = path.join(financialReportsPath, "sheets");
const masterdata_account = R.pipe(
  await AccountCodeLoader.read(sheetPath),
  (x) => AccountCodeLoader.convert(x),
);

/**
 * 마스터데이터는 한번만 불러오면 불변
 * ...인데 배포 이후에는 마스터데이터 전략을 바꿔야한다
 */
const MasterData = Object.freeze({
  accountCodes: masterdata_account.accountCodes,
  accountTags: masterdata_account.accountTags,
});

const rootUserId = 1;

const insertBulk_user = async (db: KyselyDB) => {
  const item: UserSchema.NewRow = {
    id: rootUserId,
    supabase: "root",
  };
  return await db
    .insertInto(UserSchema.name)
    .values(item)
    .executeTakeFirstOrThrow();
};

// 데이터를 다양한 방식으로 뒤지려면 db에 채워놓는게 나을듯
const insertBulk_accountTag = async (db: KyselyDB) => {
  const items = MasterData.accountTags.map((x): AccountTagSchema.NewRow => {
    return {
      code: x.code,
      major: x.major,
      minor: x.minor,
      name: x.name,
      description: x.description,
    };
  });

  return await db
    .insertInto(AccountTagSchema.name)
    .values(items)
    .executeTakeFirstOrThrow();
};

const insertBulk_accountCode = async (db: KyselyDB) => {
  const items = MasterData.accountCodes.map((x): AccountCodeSchema.NewRow => {
    return {
      code: x.code,
      name: x.name,
      description: x.description,
    };
  });

  return await db
    .insertInto(AccountCodeSchema.name)
    .values(items)
    .executeTakeFirstOrThrow();
};

const insertBulk_journal = async (db: KyselyDB) => {
  const results = journalContext.entries.map((x) =>
    JournalEntryService.prepare(x),
  );
  const rows_entry = results.flatMap((x) => x.entries);
  const rows_line = results.flatMap((x) => x.lines);

  const result_entry = await db
    .insertInto(JournalEntrySchema.name)
    .values(rows_entry)
    .executeTakeFirstOrThrow();

  const result_line = await db
    .insertInto(JournalEntryLineSchema.name)
    .values(rows_line)
    .executeTakeFirstOrThrow();

  return {
    entry: result_entry,
    line: result_line,
  };
};

const deleteAll = async (db: KyselyDB) => {
  await db.deleteFrom(AccountTagSchema.name).execute();
  await db.deleteFrom(AccountCodeSchema.name).execute();
  await db.deleteFrom(JournalEntrySchema.name).execute();
  await db.deleteFrom(JournalEntryLineSchema.name).execute();
  await db.deleteFrom(UserSchema.name).execute();
};

const insertBulk = async (db: KyselyDB) => {
  R.pipe(await insertBulk_accountTag(db), (x) =>
    console.log(`account tags: ${x.numInsertedOrUpdatedRows}`),
  );
  R.pipe(await insertBulk_accountCode(db), (x) =>
    console.log(`account codes: ${x.numInsertedOrUpdatedRows}`),
  );
  R.pipe(await insertBulk_journal(db), (x) => {
    console.log(`journal entry: ${x.entry.numInsertedOrUpdatedRows}`);
    console.log(`journal entry line: ${x.line.numInsertedOrUpdatedRows}`);
  });
  R.pipe(await insertBulk_user(db), (x) =>
    console.log(`users: ${x.numInsertedOrUpdatedRows}`),
  );

  await db.destroy();
};

const main_sqlite = async () => {
  // db
  const filename = "sqlite.db";
  await fs.unlink(filename).catch(() => {});

  const database = new SQLite(filename);
  const dialect = new SqliteDialect({
    database: database,
  });
  const db = new Kysely<Database>({
    dialect,
    plugins: [new CamelCasePlugin()],
  });

  await Database.prepareSchema(db);
  await insertBulk(db);
};

const main_pg = async () => {
  const databaseUrl =
    "postgres://localhost_dev:localhost_dev@localhost:5432/localhost_dev";
  const pool = new Postgres.Pool({
    connectionString: databaseUrl,
  });
  const dialect = new PostgresDialect({
    pool,
  });
  const db = new Kysely<Database>({
    dialect,
    plugins: [new WithSchemaPlugin("yuuka"), new CamelCasePlugin()],
  });

  await deleteAll(db);
  await insertBulk(db);
};

const target = process.argv[process.argv.length - 1];
switch (target) {
  case "sqlite":
    await main_sqlite();
    break;
  case "pg":
    await main_pg();
    break;
  default:
    console.log("invalid target");
    break;
}
