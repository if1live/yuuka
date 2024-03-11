import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import type { Database } from "../src/tables.js";

export const createTestingKysely = () => {
  const database = new SQLite(":memory:");
  const dialect = new SqliteDialect({
    database: database,
  });
  const db = new Kysely<Database>({
    dialect,
  });
  return db;
};
