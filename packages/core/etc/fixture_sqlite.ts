import fs from "node:fs/promises";
import path from "node:path";
import {
  AccountCodeSchema,
  AccountTagSchema,
  Database,
  JournalEntryLineSchema,
  JournalEntrySchema,
  UserSchema,
} from "@yuuka/db";
import { default as SQLite } from "better-sqlite3";
import { CamelCasePlugin, Kysely, SqliteDialect, sql } from "kysely";
import * as R from "remeda";
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

const insertBulk_user = async (db: Kysely<Database>) => {
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
const insertBulk_accountTag = async (db: Kysely<Database>) => {
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

const insertBulk_accountCode = async (db: Kysely<Database>) => {
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

const insertBulk_journalEntry = async (db: Kysely<Database>) => {
  const items = journalContext.entries.map(
    (journal): JournalEntrySchema.NewRow => {
      return {
        entryId: journal.id,
        date: journal.date,
        brief: journal.brief,
      };
    },
  );
  return await db
    .insertInto(JournalEntrySchema.name)
    .values(items)
    .executeTakeFirstOrThrow();
};

const insertBulk_journalEntryLine = async (db: Kysely<Database>) => {
  const items = journalContext.entries.flatMap((journal) => {
    const lines = journal.lines.map((line): JournalEntryLineSchema.NewRow => {
      const skel = {
        entryId: journal.id,
        code: line.code,
      };

      if (line._tag === "debit") {
        return {
          ...skel,
          tag: JournalEntryLineSchema.debitTag,
          amount: line.debit,
        };
      }

      if (line._tag === "credit") {
        return {
          ...skel,
          tag: JournalEntryLineSchema.creditTag,
          amount: line.credit,
        };
      }

      throw new Error("unreachable");
    });
    return lines;
  });

  return await db
    .insertInto(JournalEntryLineSchema.name)
    .values(items)
    .executeTakeFirstOrThrow();
};

const deleteAll = async (db: Kysely<Database>) => {
  await db.deleteFrom(AccountTagSchema.name).execute();
  await db.deleteFrom(AccountCodeSchema.name).execute();
  await db.deleteFrom(JournalEntrySchema.name).execute();
  await db.deleteFrom(JournalEntryLineSchema.name).execute();
  await db.deleteFrom(UserSchema.name).execute();
};

const insertBulk = async (db: Kysely<Database>) => {
  R.pipe(await insertBulk_accountTag(db), (x) =>
    console.log(`account tags: ${x.numInsertedOrUpdatedRows}`),
  );
  R.pipe(await insertBulk_accountCode(db), (x) =>
    console.log(`account codes: ${x.numInsertedOrUpdatedRows}`),
  );
  R.pipe(await insertBulk_journalEntry(db), (x) =>
    console.log(`journal entries: ${x.numInsertedOrUpdatedRows}`),
  );
  R.pipe(await insertBulk_journalEntryLine(db), (x) =>
    console.log(`journal entry lines: ${x.numInsertedOrUpdatedRows}`),
  );
  R.pipe(await insertBulk_user(db), (x) =>
    console.log(`users: ${x.numInsertedOrUpdatedRows}`),
  );

  await db.destroy();
};

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
