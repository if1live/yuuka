import { faker } from "@faker-js/faker";
import { assert, afterAll, beforeAll, describe, expect, it } from "vitest";
import { AccountTransactionRepository } from "../../../src/journals/repositories/index.js";
import {
  AccountTransactionTable,
  LedgerTransactionTable,
} from "../../../src/tables/index.js";
import { TestDatabase } from "../../TestDatabase.js";

describe("AccountTransactionRepository", () => {
  const db = TestDatabase.empty({});

  const txid = faker.string.alphanumeric(8);

  beforeAll(async () => {
    await TestDatabase.synchronize(db);

    const date = "2024-03-01" as const;
    const entry: AccountTransactionTable.NewRow = {
      txid,
      date,
      brief: faker.lorem.sentence(),
    };
    await db.insertInto(AccountTransactionTable.name).values(entry).execute();

    const skel = { txid, date };
    const { debitTag, creditTag } = LedgerTransactionTable;
    const lines: LedgerTransactionTable.NewRow[] = [
      { ...skel, code: 102, tag: debitTag, amount: 100 },
      { ...skel, code: 103, tag: creditTag, amount: 100 },
    ];
    await db.insertInto(LedgerTransactionTable.name).values(lines).execute();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it("findByIdOrThrow: exists", async () => {
    const entry = await AccountTransactionRepository.findByIdOrThrow(db, txid);
    assert.strictEqual(entry.lines_debit.length, 1);
    assert.strictEqual(entry.lines_credit.length, 1);
  });

  it("findByIdOrThrow: not exists", async () => {
    expect(() =>
      AccountTransactionRepository.findByIdOrThrow(db, "invalid"),
    ).rejects.toThrow();
  });

  it("findByDateRange: exists", async () => {
    const entries = await AccountTransactionRepository.findByDateRange(db, {
      start: "2024-03-01",
      end: "2024-03-02",
    });
    assert.strictEqual(entries.length, 1);
  });

  it("findByDateRange: not exists", async () => {
    const entries = await AccountTransactionRepository.findByDateRange(db, {
      start: "2024-03-02",
      end: "2024-03-03",
    });
    assert.strictEqual(entries.length, 0);
  });
});
