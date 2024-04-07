import type { Session } from "@supabase/supabase-js";
import type { Hono } from "hono";
import { CamelCasePlugin, type Dialect, Kysely } from "kysely";
import { SqlJsDialect } from "kysely-wasm";
import { createContext } from "react";
import type { Database as SqliteDatabase } from "sql.js";
import type { MyDatabase, MyKysely } from "../../index.js";

/**
 * sqlite 파일을 브라우저에 집어넣고 돌리기
 * 서버 운영같은거 신경 안써도 되서 편하다
 */
type DataSourceValue_Sandbox = {
  _tag: "sandbox";
  sqlite: SqliteDatabase;
  db: MyKysely;
  app: Hono;
};

/**
 * supabase storage로 sqlite db 자체를 읽고 쓰는 기능
 * 웹에서 장부를 수정할때 필요하다
 */
type DataSourceValue_Supabase = {
  _tag: "supabase";
  sqlite: SqliteDatabase;
  db: MyKysely;
  app: Hono;
  session: Session;
};

/**
 * 로컬 개발 환경에서는 vite와 hono가 따로 작동한다.
 * client-server 모델을 사용해서 개발 주기를 단축한다
 */
type DataSourceValue_Api = {
  _tag: "api";
  endpoint: string;
};

export type DataSourceValue =
  | DataSourceValue_Sandbox
  | DataSourceValue_Supabase
  | DataSourceValue_Api;

const defaultValue: DataSourceValue = {
  _tag: "api",
  endpoint: "://127.0.0.1:3000",
};

export const DataSourceContext = createContext<DataSourceValue>(defaultValue);

const createDialect = (database: SqliteDatabase) => {
  return new SqlJsDialect({ database });
};

const createKysely = (dialect: Dialect) => {
  const db = new Kysely<MyDatabase>({
    dialect,
    plugins: [new CamelCasePlugin()],
    // log: ["error", "query"],
  });
  return db;
};

export const DataSourceValue = {
  defaultValue,
  createKysely,
  createDialect,
};
