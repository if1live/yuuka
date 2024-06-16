import { CamelCasePlugin, Kysely } from "kysely";
import { SqlJsDialect } from "kysely-wasm";
import initSqlJs from "sql.js";
import { KyselyHelper } from "../src/index.js";
import type { MyConfig } from "../src/rdbms/loader.js";
import type { MyDatabase } from "../src/rdbms/types.js";

// vitest 환경에서는 node_modules 에서 잘 가져오더라
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

export const TestDatabase = {
  empty: fromEmpty,
  synchronize: KyselyHelper.createSchema,
};
