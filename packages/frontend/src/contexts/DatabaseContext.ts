import type { Database } from "@yuuka/db";
import type { Hono } from "hono";
import { CamelCasePlugin, type Dialect, Kysely } from "kysely";
import { SqlJsDialect } from "kysely-wasm";
import { createContext } from "react";
import initSqlJs from "sql.js";

// https://sql.js.org/#/?id=usage
// https://stackoverflow.com/a/75806317
// TODO: 더 멀쩡한 방법 찾아서 교체하기
const prepareSqlJs = async () => {
  const sqlJs = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });
  return sqlJs;
};

export interface DatabaseValue {
  db: Kysely<Database>;
  mode: "sandbox" | "network";
  username: string;
  // TODO: 싱글턴처럼 쓰는것을 전부 묶어서 어떻게 들고다니지?
  app: Hono;
}

const defaultValue: DatabaseValue = {
  db: {} as Kysely<Database>,
  mode: "sandbox",
  username: "",
  app: {} as Hono,
};

export const DatabaseContext = createContext(defaultValue);

const createDialect_arrayBuffer = async (buffer: ArrayBuffer) => {
  const sqlJs = await prepareSqlJs();
  const database = new sqlJs.Database(new Uint8Array(buffer));
  const dialect = new SqlJsDialect({ database });
  return dialect;
};

const createDialect_blank = async () => {
  const sqlJs = await prepareSqlJs();
  const database = new sqlJs.Database();
  const dialect = new SqlJsDialect({ database });
  return dialect;
};

const createKysely = (dialect: Dialect) => {
  const db = new Kysely<Database>({
    dialect,
    plugins: [new CamelCasePlugin()],
    // log: ["error", "query"],
  });
  return db;
};

export const DatabaseValue = {
  defaultValue,
  createDialect_arrayBuffer,
  createDialect_blank,
  createKysely,
};
