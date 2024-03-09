import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import type { Insertable } from "kysely";
import { journalContext } from "./instances.js";
import { MasterData } from "./masterdata/instances.js";
import type {
  AccountCodeTable,
  Database,
  JournalEntryLineTable,
  JournalEntryTable,
} from "./tables.js";

export const createDialect = (filename: string) => {
  return new SqliteDialect({
    database: new SQLite(filename),
  });
};

const dialect = createDialect(":memory:");

export const db = new Kysely<Database>({
  dialect,
});

// TODO: 테이블 규격 관리 어디서 하지?
type PrepareFn = (db: Kysely<Database>) => Promise<void>;

const parepare_accountCode: PrepareFn = async (db) => {
  await db.schema
    .createTable("accountCode")
    .addColumn("code", "integer", (c) => c.primaryKey())
    .addColumn("tag", "integer")
    .addColumn("name", "varchar(255)")
    .addColumn("description", "varchar(255)")
    .execute();

  await db.schema
    .createIndex("idx_accountCode_tag")
    .on("accountCode")
    .columns(["tag"])
    .execute();
};

const parepare_journalEntry: PrepareFn = async (db) => {
  await db.schema
    .createTable("journalEntry")
    .addColumn("txid", "varchar(255)", (c) => c.primaryKey())
    .addColumn("date", "varchar(255)")
    .addColumn("brief", "varchar(255)")
    .execute();
};

const parepare_journalEntryLine: PrepareFn = async (db) => {
  await db.schema
    .createTable("journalEntryLine")
    .addColumn("txid", "varchar(255)")
    .addColumn("code", "integer")
    .addColumn("debit", "integer")
    .addColumn("credit", "integer")
    .execute();

  await db.schema
    .createIndex("idx_journalEntryLine_txid")
    .on("journalEntryLine")
    .columns(["txid"])
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
  const items = MasterData.accountCodes.map(
    (x): Insertable<AccountCodeTable> => {
      return {
        code: x.code,
        tag: Math.floor(x.code / 1000),
        name: x.name,
        description: x.description,
      };
    },
  );

  await db.insertInto("accountCode").values(items).execute();
};

const insertBulk_journalEntry = async (db: Kysely<Database>) => {
  const items = journalContext.entries.map(
    (journal): Insertable<JournalEntryTable> => {
      return {
        txid: journal.txid,
        date: journal.date,
        brief: journal.brief,
      };
    },
  );
  await db.insertInto("journalEntry").values(items).execute();
};

const insertBulk_journalEntryLine = async (db: Kysely<Database>) => {
  const items = journalContext.entries.flatMap((journal) => {
    const lines = journal.lines.map(
      (line): Insertable<JournalEntryLineTable> => {
        const debit = line._tag === "debit" ? line.debit : 0;
        const credit = line._tag === "credit" ? line.credit : 0;

        return {
          code: line.code,
          txid: journal.txid,
          debit,
          credit,
        };
      },
    );
    return lines;
  });

  await db.insertInto("journalEntryLine").values(items).execute();
};

export const insertBulk = async (db: Kysely<Database>) => {
  await insertBulk_accountCode(db);
  await insertBulk_journalEntry(db);
  await insertBulk_journalEntryLine(db);
};
