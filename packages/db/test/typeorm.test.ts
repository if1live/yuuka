import type { Kysely } from "kysely";
import { assert, afterAll, beforeAll, describe, it } from "vitest";
import { TestDatabase } from "../internal/index.js";
import { PreferenceSchema } from "../src/entities/index.js";
import type { Database } from "../src/index.js";

async function assert_scenario(db: Kysely<Database>) {
  const input: PreferenceSchema.NewRow = {
    key: "foo",
    value: "bar",
  };

  await db.insertInto(PreferenceSchema.name).values(input).execute();

  const found = await db
    .selectFrom(PreferenceSchema.name)
    .selectAll()
    .executeTakeFirstOrThrow();
  assert.deepStrictEqual(found, input);
}

describe("typeorm#better-sqlite3", () => {
  describe("first", () => {
    const db = TestDatabase.create();
    beforeAll(async () => TestDatabase.synchronize(db));
    afterAll(async () => db.destroy());
    it("scenario", async () => assert_scenario(db));
  });

  // 연속으로 사용할떄 문제 없어야한다
  describe("second", () => {
    const db = TestDatabase.create();
    beforeAll(async () => TestDatabase.synchronize(db));
    afterAll(async () => db.destroy());
    it("scenario", async () => assert_scenario(db));
  });
});
