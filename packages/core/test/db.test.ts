import type { KyselyDB } from "@yuuka/db";
import { PreferenceSchema } from "@yuuka/db";
import { assert, afterAll, beforeAll, describe, it } from "vitest";
import { TestDatabase } from "./mod.js";

async function assert_scenario(db: KyselyDB) {
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

describe("db", () => {
  describe("first", () => {
    const db = TestDatabase.create();
    beforeAll(async () => TestDatabase.synchronize(db));
    afterAll(async () => db.destroy());
    it("ok", async () => assert_scenario(db));
  });

  describe("second", () => {
    const db = TestDatabase.create();
    beforeAll(async () => TestDatabase.synchronize(db));
    afterAll(async () => db.destroy());
    it("ok", async () => assert_scenario(db));
  });
});
