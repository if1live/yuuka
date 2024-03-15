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

const rootUserId = 1;

// 데이터를 다양한 방식으로 뒤지려면 db에 채워놓는게 나을듯
const insertBulk_accountCode = async (db: Kysely<Database>) => {
  const items = MasterData.accountCodes.map((x): AccountCodeSchema.NewRow => {
    return {
      userId: rootUserId,
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
        userId: rootUserId,
        entryId: journal.id,
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
      const skel = {
        userId: rootUserId,
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

  await db.insertInto(JournalEntryLineSchema.name).values(items).execute();
};

export const insertBulk = async (db: Kysely<Database>) => {
  // 첫행이 존재하면 테이블이 비어있지 않은거로 해석
  {
    const found = await db
      .selectFrom(AccountCodeSchema.name)
      .selectAll()
      .executeTakeFirst();
    if (!found) {
      await insertBulk_accountCode(db);
    }
  }

  {
    const found = await db
      .selectFrom(JournalEntrySchema.name)
      .selectAll()
      .executeTakeFirst();
    if (!found) {
      await insertBulk_journalEntry(db);
    }
  }

  {
    const found = await db
      .selectFrom(JournalEntryLineSchema.name)
      .selectAll()
      .executeTakeFirst();
    if (!found) {
      await insertBulk_journalEntryLine(db);
    }
  }
};
