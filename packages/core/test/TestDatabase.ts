import { default as SQLite } from "better-sqlite3";
import { Kysely, type KyselyConfig } from "kysely";
import { CamelCasePlugin, SqliteAdapter, SqliteDialect, sql } from "kysely";
import { MyDatabase } from "../src/tables/index.js";

const synchronize_sqlite = async <T>(db: Kysely<T>) => {
  await MyDatabase.createSchema(db);
};

const synchronize = async <T>(db: Kysely<T>) => {
  const adapter = db.getExecutor().adapter;
  if (adapter instanceof SqliteAdapter) {
    return synchronize_sqlite(db);
  }
  // else...
  throw new Error("unsupported database");
};

/**
 * kysely 객체를 destory한 다음에 다시 사용할순 없다.
 * 그래서 유닛테스트 돌릴떄마다 새로운 객체를 준비한다.
 * 플러그인을 수동으로 동기화는건 좀 멍청하지만 자주 안바꾸니까 괜찮을듯.
 */
const create = (opts?: Omit<KyselyConfig, "dialect">) => {
  const database = new SQLite(":memory:");
  const dialect = new SqliteDialect({ database });
  const db = new Kysely<MyDatabase>({
    ...opts,
    dialect,
    plugins: [new CamelCasePlugin()],
  });
  return db;
};

export const TestDatabase = {
  synchronize,
  create,
};
