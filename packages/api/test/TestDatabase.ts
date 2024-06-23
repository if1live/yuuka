import { CamelCasePlugin, Kysely } from "kysely";
import { SqlJsDialect } from "kysely-wasm";
import initSqlJs from "sql.js";
import type { MyConfig } from "../src/rdbms/loader.js";
import type { MyDatabase } from "../src/rdbms/types.js";
import { AccountTable } from "../src/tables/index.js";

const SQL = await initSqlJs({});

export const fromEmpty = <T = MyDatabase>(opts: MyConfig) => {
  const sqlite = new SQL.Database([]);
  const dialect = new SqlJsDialect({ database: sqlite });
  const db = new Kysely<T>({
    dialect,
    plugins: [new CamelCasePlugin()],
    ...opts,
  });
  return { db, sqlite };
};

const synchronize = async <T>(db: Kysely<T>) => {
  await AccountTable.defineSchema_sqlite(db).execute();
};

export const TestDatabase = {
  empty: fromEmpty,
  synchronize,
};
