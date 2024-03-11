import type { Database } from "@yuuka/db";
import SQLite from "better-sqlite3";
import { CamelCasePlugin, Kysely, SqliteDialect } from "kysely";

export const createTestingKysely = () => {
  const database = new SQLite(":memory:");
  const dialect = new SqliteDialect({
    database: database,
  });
  const db = new Kysely<Database>({
    dialect,
    plugins: [new CamelCasePlugin()],
  });
  return db;
};
