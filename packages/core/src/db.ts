import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import type { Database } from "./tables.js";

export const createDialect = (filename: string) => {
  return new SqliteDialect({
    database: new SQLite(filename),
  });
};

const dialect = createDialect(":memory:");

export const db = new Kysely<Database>({
  dialect,
});
