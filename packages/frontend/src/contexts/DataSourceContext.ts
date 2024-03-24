import type { Session } from "@supabase/supabase-js";
import type { Database, KyselyDB } from "@yuuka/db";
import type { Hono } from "hono";
import { CamelCasePlugin, type Dialect, Kysely } from "kysely";
import { SqlJsDialect } from "kysely-wasm";
import { createContext } from "react";
import initSqlJs, { type Database as SqliteDatabase } from "sql.js";

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

/**
 * sqlite 파일을 브라우저에 집어넣고 돌리기
 * 서버 운영같은거 신경 안써도 되서 편하다
 */
type DataSourceValue_Sandbox = {
  _tag: "sandbox";
  sqlite: SqliteDatabase;
  db: KyselyDB;
  app: Hono;
};

/**
 * supabase storage로 sqlite db 자체를 읽고 쓰는 기능
 * 웹에서 장부를 수정할때 필요하다
 */
type DataSourceValue_Supabase = {
  _tag: "supabase";
  sqlite: SqliteDatabase;
  db: KyselyDB;
  app: Hono;
  session: Session;
};

/**
 * 로컬 개발 환경에서는 vite와 hono가 따로 작동한다.
 * client-server 모델을 사용해서 개발 주기를 단축한다
 */
type DataSourceValue_Server = {
  _tag: "server";
  endpoint: string;
};

export type DataSourceValue =
  | DataSourceValue_Sandbox
  | DataSourceValue_Supabase
  | DataSourceValue_Server;

const defaultValue: DataSourceValue = {
  _tag: "server",
  endpoint: "://127.0.0.1:3000",
};

export const DataSourceContext = createContext<DataSourceValue>(defaultValue);

const createDialect_arrayBuffer = async (buffer: ArrayBuffer) => {
  const sqlJs = await prepareSqlJs();
  const database = new sqlJs.Database(new Uint8Array(buffer));
  const dialect = new SqlJsDialect({ database });
  return {
    sqlite: database,
    dialect,
  };
};

const createDialect_blank = async () => {
  const sqlJs = await prepareSqlJs();
  const database = new sqlJs.Database();
  const dialect = new SqlJsDialect({ database });
  return {
    sqlite: database,
    dialect,
  };
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
