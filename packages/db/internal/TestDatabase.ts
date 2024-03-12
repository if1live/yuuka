import { default as SQLite } from "better-sqlite3";
import { Kysely } from "kysely";
import { CamelCasePlugin, SqliteAdapter, SqliteDialect, sql } from "kysely";
import { DataSource } from "typeorm";
import type { EntitySchema } from "typeorm";
import type { Database } from "../src/tables.js";
import { entitySchemaList } from "./entities.js";

/**
 * 테이블 생성 목적으로만 사용하는 typeorm 사용한다.
 * typescript 5.2 using disposable 써보려고 했는데 vitest에서 잘 안되서 던짐
 */
const createSchemaQuery_sqlite = async (entities: EntitySchema[]) => {
  const dataSource = new DataSource({
    type: "better-sqlite3",
    database: ":memory:",
    entities,
  });
  await dataSource.initialize();

  const builder = dataSource.driver.createSchemaBuilder();
  const sqlInMemory = await builder.log();
  const queries = sqlInMemory.upQueries.map((x) => x.query);

  await dataSource.destroy();
  return { _tag: "sqlite", queries };
};

const snapshot_sqlite = await createSchemaQuery_sqlite(entitySchemaList);

const synchronize_sqlite = async <T>(db: Kysely<T>) => {
  for (const line of snapshot_sqlite.queries) {
    const input = line as unknown as TemplateStringsArray;
    const compiled = sql<unknown>(input).compile(db);
    await db.executeQuery(compiled);
  }
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
const create = () => {
  const database = new SQLite(":memory:");
  const dialect = new SqliteDialect({ database });
  const db = new Kysely<Database>({
    dialect,
    plugins: [new CamelCasePlugin()],
  });
  return db;
};

export const TestDatabase = {
  synchronize,
  create,
};
