import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";
import { default as SQLite } from "better-sqlite3";
import {
  CamelCasePlugin,
  Kysely,
  PostgresDialect,
  SqliteDialect,
  WithSchemaPlugin,
  sql,
} from "kysely";
import * as R from "remeda";
import type { Journal } from "../src/index.js";
import { JournalService } from "../src/journals/services/index.js";
import { KyselyHelper } from "../src/rdbms/index.js";
import type { MyDatabase, MyKysely } from "../src/rdbms/types.js";
import { AccountCodeLoader } from "../src/synchronizations/AccountCodeLoader.js";
import { AccountStatementLoader } from "../src/synchronizations/AccountStatementLoader.js";
import { JournalLoader } from "../src/synchronizations/JournalLoader.js";
import {
  AccountGroupTable,
  AccountStatementTable,
  AccountTable,
  AccountTransactionTable,
  LedgerTransactionTable,
} from "../src/tables/index.js";

// https://blog.logrocket.com/alternatives-dirname-node-js-es-modules/
const filename = url.fileURLToPath(import.meta.url);
const dirname = url.fileURLToPath(new URL(".", import.meta.url));
const rootPath = path.join(dirname, "..");

const financialReportsDir = "personal-financial-statements";
const financialReportsPath = path.resolve(rootPath, "..", financialReportsDir);

// TODO: journal은 가변데이터가 가까운데 어디에서 취급하지?
// TODO: 하드코딩 줄일 방법?
const journalFiles = ["journal_2024_03.csv", "journal_2024_04.csv","journal_2024_05.csv"];
const journalPath = path.join(financialReportsPath, "journals");
const journalEntries: Journal[] = [];
for (const f of journalFiles) {
  const result = await JournalLoader.read(journalPath, f);
  const context = JournalLoader.convert(result);
  journalEntries.push(...context.entries);
}

const accountStatementFiles = [
  "AccountStatement_2024_03.csv",
  "AccountStatement_2024_04.csv",
  "AccountStatement_2024_05.csv",
];
const accountStatements: AccountStatementTable.NewRow[] = [];
const accountStatementPath = path.join(financialReportsPath, "accounts");
for (const f of accountStatementFiles) {
  const result = await AccountStatementLoader.read(accountStatementPath, f);
  const context = AccountStatementLoader.convert(result);
  accountStatements.push(...context.entries);
}

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
  accountGroups: masterdata_account.accountGroups,
  accounts: masterdata_account.accounts,
});

// 데이터를 다양한 방식으로 뒤지려면 db에 채워놓는게 나을듯
const insertBulk_accountGroup = async (db: MyKysely) => {
  const items = MasterData.accountGroups.map((x): AccountGroupTable.NewRow => {
    return {
      code: x.code,
      major: x.major,
      minor: x.minor,
      name: x.name,
      description: x.description,
    };
  });

  return await db
    .insertInto(AccountGroupTable.name)
    .values(items)
    .executeTakeFirstOrThrow();
};

const insertBulk_account = async (db: MyKysely) => {
  const items = MasterData.accounts.map((x): AccountTable.NewRow => {
    return {
      code: x.code,
      name: x.name,
      description: x.description,
    };
  });

  return await db
    .insertInto(AccountTable.name)
    .values(items)
    .executeTakeFirstOrThrow();
};

const insertBulk_journal = async (db: MyKysely) => {
  const results = journalEntries.map((x) => JournalService.prepare(x));
  const rows_account = results.flatMap((x) => x.accounts);
  const rows_ledger = results.flatMap((x) => x.ledgers);

  const result_entry = await db
    .insertInto(AccountTransactionTable.name)
    .values(rows_account)
    .executeTakeFirstOrThrow();

  const result_line = await db
    .insertInto(LedgerTransactionTable.name)
    .values(rows_ledger)
    .executeTakeFirstOrThrow();

  return {
    entry: result_entry,
    line: result_line,
  };
};

const insertBulk_accountStatement = async (db: MyKysely) => {
  const rows = accountStatements;
  return await db
    .insertInto(AccountStatementTable.name)
    .values(rows)
    .executeTakeFirstOrThrow();
};

const insertBulk = async (db: MyKysely) => {
  R.pipe(await insertBulk_accountGroup(db), (x) =>
    console.log(`account tags: ${x.numInsertedOrUpdatedRows}`),
  );
  R.pipe(await insertBulk_account(db), (x) =>
    console.log(`account codes: ${x.numInsertedOrUpdatedRows}`),
  );
  R.pipe(await insertBulk_journal(db), (x) => {
    console.log(`journal entry: ${x.entry.numInsertedOrUpdatedRows}`);
    console.log(`journal entry line: ${x.line.numInsertedOrUpdatedRows}`);
  });
  R.pipe(await insertBulk_accountStatement(db), (x) =>
    console.log(`account statement: ${x.numInsertedOrUpdatedRows}`),
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
  const db = new Kysely<MyDatabase>({
    dialect,
    plugins: [new CamelCasePlugin()],
  });

  await KyselyHelper.createSchema(db);
  await insertBulk(db);
};

const target = process.argv[process.argv.length - 1];
switch (target) {
  case "sqlite":
    await main_sqlite();
    break;
  default:
    await main_sqlite();
    break;
}
