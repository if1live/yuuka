import { default as SQLite } from "better-sqlite3";
import { CamelCasePlugin, Kysely, SqliteDialect } from "kysely";
import { KyselyHelper } from "../src/index.js";
import type { MyConfig } from "../src/rdbms/loader.js";
import type { MyDatabase } from "../src/rdbms/types.js";

// vitest 환경에서 sql.js 사용하면 wasm 경로 삽질해야되는데 귀찮아서 better-sqlite3 사용
export const fromEmpty = <T = MyDatabase>(opts: MyConfig) => {
  const database = new SQLite(":memory:");
  const dialect = new SqliteDialect({
    database: database,
  });
  const db = new Kysely<T>({
    dialect,
    plugins: [new CamelCasePlugin()],
  });
  return db;
};

export const TestDatabase = {
  empty: fromEmpty,
  synchronize: KyselyHelper.createSchema,
};
