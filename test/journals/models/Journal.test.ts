import { assert, describe, it } from "vitest";
import { Journal } from "../../../src/journals/models/Journal.js";
import type {
  JournalLine_Credit,
  JournalLine_Debit,
} from "../../../src/journals/models/JournalLine.js";

describe("Journal", () => {
  const skel = {
    id: "1",
    date: "2024-03-01",
    brief: "마트에서 식비/주류 네이버페이로",
  };

  it("ok", () => {
    const lines_debit: JournalLine_Debit[] = [
      { _tag: "debit", code: 853000, debit: 7740 },
      { _tag: "debit", code: 854000, debit: 7740 },
    ];
    const lines_credit: JournalLine_Credit[] = [
      { _tag: "credit", code: 102101, credit: 15480 },
    ];

    const entry: Journal = {
      ...skel,
      lines_debit,
      lines_credit,
    };
    const actual = Journal.validate(entry);
    assert.ok(actual);
  });

  it("fail: empty line", () => {
    const entry: Journal = {
      ...skel,
      lines_credit: [],
      lines_debit: [],
    };

    assert.throws(() => Journal.validate(entry));
  });

  it("fail: credit !== debit", () => {
    const lines_debit: JournalLine_Debit[] = [
      { _tag: "debit", code: 853000, debit: 1 },
    ];
    const lines_credit: JournalLine_Credit[] = [
      { _tag: "credit", code: 102101, credit: 2 },
    ];
    const entry: Journal = {
      ...skel,
      lines_credit,
      lines_debit,
    };
    assert.throws(() => Journal.validate(entry));
  });
});
