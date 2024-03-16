import type { Database } from "@yuuka/db";
import {
  CamelCasePlugin,
  Kysely,
  PostgresDialect,
  SqliteDialect,
  WithSchemaPlugin,
} from "kysely";
import type { Dialect } from "kysely";
import { default as Postgres } from "pg";
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

const createKysely = (dialect: Dialect) => {
  return new Kysely<Database>({
    dialect,
    plugins: [new WithSchemaPlugin("yuuka"), new CamelCasePlugin()],
  });
};

const { dialect } = await createDialect(settings.databaseUrl);
export const db = createKysely(dialect);
