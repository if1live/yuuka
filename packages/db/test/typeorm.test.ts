import { default as SQLite } from "better-sqlite3";
import { CamelCasePlugin, Kysely, SqliteDialect } from "kysely";
import { assert, afterAll, beforeAll, describe, it } from "vitest";
import { TestDatabase } from "../internal/index.js";
import type { Database } from "../src/index.js";
import { AccountCodeSchema } from "../src/index.js";

const createKysely = () => {
  const database = new SQLite(":memory:");
  const dialect = new SqliteDialect({ database: database });
  const db = new Kysely<Database>({
    dialect,
    plugins: [new CamelCasePlugin()],
  });
  return db;
};

async function assert_scenario(db: Kysely<Database>) {
  const input: AccountCodeSchema.NewRow = {
    code: 1,
    name: "foo",
    description: "bar",
  };

  await db.insertInto(AccountCodeSchema.name).values(input).execute();

  const found = await db
    .selectFrom(AccountCodeSchema.name)
    .selectAll()
    .executeTakeFirstOrThrow();
  assert.deepStrictEqual(found, input);
}

describe("typeorm#better-sqlite3", () => {
  describe("first", () => {
    const db = createKysely();
    beforeAll(async () => TestDatabase.synchronize(db));
    afterAll(async () => db.destroy());
    it("scenario", async () => assert_scenario(db));
  });

  // 연속으로 사용할떄 문제 없어야한다
  describe("second", () => {
    const db = createKysely();
    beforeAll(async () => TestDatabase.synchronize(db));
    afterAll(async () => db.destroy());
    it("scenario", async () => assert_scenario(db));
  });
});
