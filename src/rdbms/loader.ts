import type { KyselyConfig } from "kysely";
import { CamelCasePlugin, Kysely } from "kysely";
import { SqlJsDialect } from "kysely-wasm";
import type { SqlJsConfig } from "sql.js";
import initSqlJs from "sql.js";
import type { MyDatabase } from "./types.js";

/**
 * locateFile을 설정하지 않으면 wasm 제대로 못받아서 터진다
 * https://stackoverflow.com/a/75806317
 * https://sql.js.org/#/?id=usage
 * locateFile을 외부로 쓰는건 좀 멍청한거같지만 일단 작동하니까 유지
 */
type LocateFileFn = SqlJsConfig["locateFile"];

const locateFile_fetch: LocateFileFn = (file: string) =>
  `https://sql.js.org/dist/${file}`;

const locateFile_default = undefined;

// import.meta.env 접근시 내용은 환경에 따라 다르다.
// vite: {BASE_URL: '/yuuka/', MODE: 'development', DEV: true, PROD: false, SSR: false}
// node: 환경변수
const locateFile: LocateFileFn | undefined = typeof import.meta.env.SSR === 'boolean'
  ? locateFile_fetch
  : locateFile_default;

export const prepareSqlJs = async () => {
  const sqlJs = await initSqlJs({
    locateFile,
  });
  return sqlJs;
};

export type MyConfig = Omit<KyselyConfig, "dialect">;

export const fromBuffer = <T = MyDatabase>(
  SQL: initSqlJs.SqlJsStatic,
  buffer: Uint8Array,
  opts: MyConfig,
) => {
  const sqlite = new SQL.Database(buffer);
  const dialect = new SqlJsDialect({ database: sqlite });
  const db = new Kysely<T>({
    ...opts,
    plugins: [new CamelCasePlugin()],
    dialect,
  });
  return { db, sqlite };
};
