import { assert, afterAll, beforeAll, describe, it } from "vitest";
import { AccountCodeSchema, type KyselyDB } from "../src/tables/index.js";
import { TestDatabase } from "./TestDatabase.js";

async function assert_scenario(db: KyselyDB) {
  const input: AccountCodeSchema.NewRow = {
    code: 101,
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
