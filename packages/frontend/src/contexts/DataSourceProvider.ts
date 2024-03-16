import type { Database } from "@yuuka/db";
import type { Hono } from "hono";
import { CamelCasePlugin, type Dialect, Kysely } from "kysely";
import { SqlJsDialect } from "kysely-wasm";
import { createContext } from "react";
import initSqlJs from "sql.js";

/**
 * locateFile을 설정하지 않으면 wasm 제대로 못받아서 터진다
 * https://stackoverflow.com/a/75806317
 * https://sql.js.org/#/?id=usage
 * locateFile을 외부로 쓰는건 좀 멍청한거같지만 일단 작동하니까 유지
 *
 * top-level async/await 함수로 쓰면 vite에서 빌드 에러 발생!
 * 함수 자체를 async로 유지하고 사용하는 지점에서 await
 */
const prepareSqlJs = async () => {
  const sqlJs = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });
  return sqlJs;
};

export interface DataSourceValue {
  db: Kysely<Database>;
  mode: "sandbox" | "network";
  username: string;
  app: Hono;
}

const defaultValue: DataSourceValue = {
  db: {} as Kysely<Database>,
  mode: "sandbox",
  username: "",
  app: {} as Hono,
};

export const DataSourceContext = createContext(defaultValue);

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

export const DataSourceValue = {
  defaultValue,
  createDialect_arrayBuffer,
  createDialect_blank,
  createKysely,
};
