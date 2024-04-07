import assert from "node:assert/strict";
import { faker } from "@faker-js/faker";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Journal } from "../../../src/journals/models/Journal.js";
import { JournalService } from "../../../src/journals/services/index.js";
import { KyselyHelper } from "../../../src/rdbms/index.js";
import { LedgerTransactionTable } from "../../../src/tables/index.js";

describe("JournalService#prepare", () => {
  const journal: Journal = {
    id: "1",
    date: "2021-02-03",
    brief: "brief",
    lines_debit: [
      { _tag: "debit", code: 101, debit: 100 },
      { _tag: "debit", code: 102, debit: 200 },
    ],
    lines_credit: [{ _tag: "credit", code: 103, credit: 100 }],
  };
  const actual = JournalService.prepare(journal);

  it("entry", () => {
    expect(actual.accounts).toHaveLength(1);

    const entry = actual.accounts[0];
    assert.ok(entry);

    assert.strictEqual(entry.txid, journal.id);
    assert.strictEqual(entry.date, journal.date);
    assert.strictEqual(entry.brief, journal.brief);
  });

  it("lines: debit", () => {
    const lines = actual.ledgers.filter(
      (x) => x.tag === LedgerTransactionTable.debitTag,
    );
    expect(lines).toHaveLength(2);
  });

  it("lines: credit", () => {
    const lines = actual.ledgers.filter(
      (x) => x.tag === LedgerTransactionTable.creditTag,
    );
    expect(lines).toHaveLength(1);
  });
});

describe("JournalService#scenario", () => {
  const db = KyselyHelper.fromEmpty({});

  beforeAll(async () => {
    await KyselyHelper.createSchema(db);
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe("happy-path", () => {
    const id = faker.string.alphanumeric(8);
    const journal: Journal = {
      id,
      date: "2021-02-03",
      brief: "brief",
      lines_debit: [
        { _tag: "debit", code: 101, debit: 100 },
        { _tag: "debit", code: 102, debit: 200 },
      ],
      lines_credit: [{ _tag: "credit", code: 103, credit: 100 }],
    };

    it("insert", async () => {
      const result = await JournalService.insert(db, journal);
      assert.ok(result);

      const found = await JournalService.read(db, id);
      assert.deepStrictEqual(found, journal);
    });

    it("update: account", async () => {
      const payload: Journal = {
        ...journal,
        brief: "updated",
      };
      const result = await JournalService.update(db, payload);

      // TODO:
      // const found = await JournalService.read(db, id);
      // assert.deepStrictEqual(found, payload);
    });

    it("update: ledger", async () => {});

    it("delete", async () => {
      const result = await JournalService.remove(db, id);

      const found = await JournalService.read(db, id);
      assert.strictEqual(found, undefined);
    });
  });
});
