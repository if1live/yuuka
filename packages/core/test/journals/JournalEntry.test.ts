import { assert, describe, it } from "vitest";
import { JournalEntry } from "../../src/journals/JournalEntry.js";
import type { JournalEntryLine } from "../../src/journals/JournalEntryLine.js";

describe("JournalEntryLine", () => {
  const skel = {
    id: "1",
    date: "2024-03-01",
    brief: "마트에서 식비/주류 네이버페이로",
  };

  it("ok", () => {
    const lines: JournalEntryLine[] = [
      { _tag: "debit", code: 853000, debit: 7740 },
      { _tag: "debit", code: 854000, debit: 7740 },
      { _tag: "credit", code: 102101, credit: 15480 },
    ];
    const entry: JournalEntry = { ...skel, lines };
    const actual = JournalEntry.validate(entry);

    // 명시적인 journal entry line으로 바뀌어야한다.
    for (const x of actual.lines) {
      assert(x._tag === "debit" || x._tag === "credit");
    }
  });

  it("fail: empty line", () => {
    const lines: JournalEntryLine[] = [];
    const entry: JournalEntry = { ...skel, lines };

    assert.throws(() => JournalEntry.validate(entry));
  });

  it("fail: credit !== debit", () => {
    const lines: JournalEntryLine[] = [
      { _tag: "debit", code: 853000, debit: 1 },
      { _tag: "credit", code: 102101, credit: 2 },
    ];
    const entry: JournalEntry = { ...skel, lines };
    assert.throws(() => JournalEntry.validate(entry));
  });
});
