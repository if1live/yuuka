import assert from "node:assert/strict";
import { describe, expect, it } from "vitest";
import { type JournalEntry, JournalEntryLine } from "../../src/index.js";
import { JournalEntryService } from "../../src/journals/JournalEntryService.js";
import {
  JournalEntryLineSchema,
  JournalEntrySchema,
} from "../../src/tables/index.js";

describe("JournalEntryService#prepare", () => {
  const journal: JournalEntry = {
    id: "1",
    date: "2021-02-03",
    brief: "brief",
    lines: [
      { _tag: "debit", code: 101, debit: 100 },
      { _tag: "debit", code: 102, debit: 200 },
      { _tag: "credit", code: 103, credit: 100 },
    ],
  };
  const actual = JournalEntryService.prepare(journal);

  it("entry", () => {
    expect(actual.entries).toHaveLength(1);

    const entry = actual.entries[0];
    assert.ok(entry);

    assert.strictEqual(entry.entryId, journal.id);
    assert.strictEqual(entry.date, journal.date);
    assert.strictEqual(entry.brief, journal.brief);
  });

  it("lines: debit", () => {
    const lines = actual.lines.filter(
      (x) => x.tag === JournalEntryLineSchema.debitTag,
    );
    expect(lines).toHaveLength(2);
  });

  it("lines: credit", () => {
    const lines = actual.lines.filter(
      (x) => x.tag === JournalEntryLineSchema.creditTag,
    );
    expect(lines).toHaveLength(1);
  });
});
