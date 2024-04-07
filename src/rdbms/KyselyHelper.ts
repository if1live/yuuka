import fs from "node:fs/promises";
import { CamelCasePlugin, Kysely } from "kysely";
import type { KyselyConfig } from "kysely";
import { SqlJsDialect } from "kysely-wasm";
import initSqlJs from "sql.js";
import type { Database, SqlJsConfig } from "sql.js";
import { NodeSystemError } from "../core/NodeSystemError.js";
import {
  AccountGroupTable,
  AccountStatementTable,
  AccountTable,
  AccountTransactionTable,
  LedgerStatementTable,
  LedgerTransactionTable,
} from "../tables/index.js";
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
// node: undefined
const locateFile: LocateFileFn | undefined = import.meta.env
  ? locateFile_fetch
  : locateFile_default;

// TODO: top-level async/await 함수로 쓰면 vite에서 빌드 에러 발생!
// TODO: vite에서는 함수 자체를 async로 유지하고 사용하는 지점에서 await
export const SQL = await initSqlJs({
  locateFile,
});

type MyConfig = Omit<KyselyConfig, "dialect">;

export const fromBuffer = <T = MyDatabase>(
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

// 유닛테스트 같은 목적으로 사용할 수 있다.
export const fromEmpty = <T = MyDatabase>(opts: MyConfig) => {
  // Buffer는 node에만 있어서 vite에서 터진다. Uint8Array를 써야 플랫폼 관계없이 작동.
  const buffer = Uint8Array.from([]);
  return fromBuffer<T>(buffer, opts);
};

export const exportFile = async (database: Database, fp: string) => {
  try {
    await fs.unlink(fp);
  } catch (e) {
    if (NodeSystemError.guard(e) && e.code === "ENOENT") {
      // Error: ENOENT: no such file or directory, ..
      // 없는 파일 삭제할때 발생하는 에러. 무시해도 됨
    } else {
      throw e;
    }
  }

  // sqlite 파일 용량 줄이기. 데이터 크기가 작아서 그런지 큰 효과는 없다
  database.exec("VACUUM");
  const buffer = database.export();
  await fs.writeFile(fp, buffer);
};

export const createSchema = async <T>(db: Kysely<T>) => {
  await AccountTable.createSchema(db);
  await AccountGroupTable.createSchema(db);
  await AccountTransactionTable.createSchema(db);
  await LedgerTransactionTable.createSchema(db);
  await AccountStatementTable.createSchema(db);
  await LedgerStatementTable.createSchema(db);
};
