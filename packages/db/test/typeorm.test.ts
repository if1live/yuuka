import { CamelCasePlugin, Kysely } from "kysely";
import { DataSource } from "typeorm";
import { assert, afterAll, beforeAll, describe, it } from "vitest";
import { TestDatabase, entitySchemaList } from "../internal/index.js";
import type { Database } from "../src/index.js";
import { AccountCodeSchema } from "../src/index.js";

describe("typeorm#better-sqlite3", () => {
  const dataSource = new DataSource({
    type: "better-sqlite3",
    database: ":memory:",
    entities: entitySchemaList,
    synchronize: true,
  });

  let db: Kysely<Database>;

  beforeAll(async () => {
    await dataSource.initialize();
    // typeorm 초기화 이후에 접근해야 제대로 나온다
    db = new Kysely<Database>({
      dialect: TestDatabase.dialect(dataSource),
      plugins: [new CamelCasePlugin()],
    });
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  const input: AccountCodeSchema.NewRow = {
    code: 1,
    name: "foo",
    description: "bar",
  };

  it("insert", async () => {
    await db.insertInto(AccountCodeSchema.name).values(input).execute();
  });

  it("select", async () => {
    const found = await db
      .selectFrom(AccountCodeSchema.name)
      .selectAll()
      .executeTakeFirstOrThrow();
    assert.deepStrictEqual(found, input);
  });
});
