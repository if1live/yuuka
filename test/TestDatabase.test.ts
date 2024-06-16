import { sql } from "kysely";
import type { Database } from "sql.js";
import { assert, afterAll, beforeAll, describe, it } from "vitest";
import type { MyKysely } from "../src/index.js";
import { QueryRunner } from "../src/rdbms/index.js";
import { TestDatabase } from "./TestDatabase.js";

describe("TestDatabase", () => {
  let db: MyKysely;
  let sqlite: Database;

  beforeAll(async () => {
    const item = TestDatabase.empty({});
    db = item.db;
    sqlite = item.sqlite;
  });

  afterAll(async () => {
    await db.destroy();
  });

  it("executeQuery", async () => {
    const query = sql`SELECT 1 + 1 AS v`.compile(db);
    const result = await db.executeQuery(query);
    const row = result.rows[0];
    assert.deepStrictEqual(row, { v: 2 });
  });

  it("query runner", () => {
    const query = sql`SELECT 1 + 1 AS v`.compile(db);
    const row = QueryRunner.executeTakeFirst(query, sqlite);
    assert.deepStrictEqual(row, { v: 2 });
  });
});
