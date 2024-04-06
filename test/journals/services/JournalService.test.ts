import assert from "node:assert/strict";
import { describe, expect, it } from "vitest";
import type { Journal } from "../../../src/journals/models/Journal.js";
import { JournalService } from "../../../src/journals/services/index.js";
import { LedgerTransactionTable } from "../../../src/tables/index.js";

describe("JournalService#prepare", () => {
  const journal: Journal = {
    id: "1",
    date: "2021-02-03",
    brief: "brief",
    lines: [
      { _tag: "debit", code: 101, debit: 100 },
      { _tag: "debit", code: 102, debit: 200 },
      { _tag: "credit", code: 103, credit: 100 },
    ],
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
