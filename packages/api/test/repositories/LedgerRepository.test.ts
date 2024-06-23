import { faker } from "@faker-js/faker";
import { assert, afterAll, beforeAll, describe, it } from "vitest";
import type { JournalEntry } from "../../src/index.js";
import type { MyKysely } from "../../src/rdbms/types.js";
import { LedgerRepository } from "../../src/repositories/index.js";
import { TestDatabase } from "../TestDatabase.js";

describe("LedgerRepository", () => {
  let db: MyKysely;

  beforeAll(async () => {
    const item = TestDatabase.empty({});
    await TestDatabase.synchronize(item.db);
    db = item.db;
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe("happy-path", () => {
    const userId = faker.string.alphanumeric(8);

    const skel = { commodity: "KRW" };
    const entry: JournalEntry = {
      id: "1",
      date: "2024-01-02",
      brief: "마트에서 식비/주류 네이버페이로",
      lines_debit: [
        { _tag: "debit", account: "853000", debit: 7740, ...skel },
        { _tag: "debit", account: "854000", debit: 7740, ...skel },
      ],
      lines_credit: [
        { _tag: "credit", account: "102101", credit: 15480, ...skel },
      ],
    };

    it("insert", async () => {
      const result = await LedgerRepository.insert(db, userId, entry);
      assert.strictEqual(result.length, 2 + 1);
    });

    it("find: exists", async () => {
      const founds = await LedgerRepository.find(db, userId);
      assert.strictEqual(founds.length, 1);

      const found = founds[0];
      assert.deepStrictEqual(found, entry);
    });

    it("remove", async () => {
      await LedgerRepository.remove(db, userId, entry.id);
    });

    it("find: not exists", async () => {
      const founds = await LedgerRepository.find(db, userId);
      assert.strictEqual(founds.length, 0);
    });
  });
});
