import { assert, describe, it } from "vitest";
import { JournalEntry } from "../../src/ledgers/JournalEntry.js";
import type {
  JournalLine_Credit,
  JournalLine_Debit,
} from "../../src/ledgers/JournalLine.js";

describe("JournalEntry", () => {
  const skel = {
    id: "1",
    date: "2024-03-01",
    brief: "마트에서 식비/주류 네이버페이로",
  } as const;

  it("ok", () => {
    const lines_debit: JournalLine_Debit[] = [
      { _tag: "debit", account: "853000", debit: 7740, commodity: "KRW" },
      { _tag: "debit", account: "854000", debit: 7740, commodity: "KRW" },
    ];
    const lines_credit: JournalLine_Credit[] = [
      { _tag: "credit", account: "102101", credit: 15480, commodity: "KRW" },
    ];

    const entry: JournalEntry = {
      ...skel,
      lines_debit,
      lines_credit,
    };
    const actual = JournalEntry.validate(entry);
    assert.ok(actual);
  });

  it("fail: empty line", () => {
    const entry: JournalEntry = {
      ...skel,
      lines_credit: [],
      lines_debit: [],
    };

    assert.throws(() => JournalEntry.validate(entry));
  });

  it("fail: credit !== debit", () => {
    const lines_debit: JournalLine_Debit[] = [
      { _tag: "debit", account: "853000", debit: 1, commodity: "KRW" },
    ];
    const lines_credit: JournalLine_Credit[] = [
      { _tag: "credit", account: "102101", credit: 2, commodity: "KRW" },
    ];
    const entry: JournalEntry = {
      ...skel,
      lines_credit,
      lines_debit,
    };
    assert.throws(() => JournalEntry.validate(entry));
  });
});
