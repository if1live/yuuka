import type { Kysely } from "kysely";
import { SqliteAdapter, sql } from "kysely";
import { DataSource } from "typeorm";
import { entitySchemaList } from "./entities.js";

// 테이블 생성 목적으로만 사용하는 typeorm 사용한다.
const prepare_sqlite = async () => {
  const dataSource = new DataSource({
    type: "better-sqlite3",
    database: ":memory:",
    entities: entitySchemaList,
  });
  await dataSource.initialize();

  const builder = dataSource.driver.createSchemaBuilder();
  const log = await builder.log();
  const queries = log.upQueries.map((x) => x.query);

  await dataSource.destroy();
  return queries;
};
const queries_sqlite = await prepare_sqlite();

/**
 * kysely dialect로 넘어가면 SQLite.Database 어떻게 접근하는지 모르겠다.
 * 그래서 원본 자체를 받도록 했다.
 */
const synchronize_sqlite = async <T>(db: Kysely<T>) => {
  for (const query of queries_sqlite) {
    const input = query as unknown as TemplateStringsArray;
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

export const TestDatabase = {
  synchronize,
};
