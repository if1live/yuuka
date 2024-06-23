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

describe("JournalEntry#derive", () => {
  const example_lines_debit: JournalLine_Debit[] = [
    { _tag: "debit", account: "853000", debit: 7740, commodity: "KRW" },
    { _tag: "debit", account: "854000", debit: 7740, commodity: "KRW" },
  ];
  const example_lines_credit: JournalLine_Credit[] = [
    { _tag: "credit", account: "102101", credit: 15480, commodity: "KRW" },
  ];
  const example: JournalEntry = {
    id: "1",
    date: "2024-03-01",
    brief: "마트에서 식비/주류 네이버페이로",
    lines_debit: example_lines_debit,
    lines_credit: example_lines_credit,
  };

  it("모든 수치가 입력된 경우", () => {
    const lines_debit: JournalLine_Debit[] = [
      { _tag: "debit", account: "853000", debit: 7740, commodity: "KRW" },
      { _tag: "debit", account: "854000", debit: 7740, commodity: "KRW" },
    ];
    const lines_credit: JournalLine_Credit[] = [
      { _tag: "credit", account: "102101", credit: 15480, commodity: "KRW" },
    ];

    const entry: JournalEntry = {
      ...example,
      lines_debit,
      lines_credit,
    };
    const actual = JournalEntry.derive(entry);
    assert.deepStrictEqual(actual, entry);
  });

  it("2개 이상의 항목이 입력되지 않은 경우", () => {
    const lines_debit: JournalLine_Debit[] = [
      { _tag: "debit", account: "853000", debit: 7740, commodity: "KRW" },
      { _tag: "debit", account: "854000", debit: 0, commodity: "KRW" },
    ];
    const lines_credit: JournalLine_Credit[] = [
      { _tag: "credit", account: "102101", credit: 0, commodity: "KRW" },
    ];

    const entry: JournalEntry = {
      ...example,
      lines_debit,
      lines_credit,
    };
    const actual = JournalEntry.derive(entry);
    assert.deepStrictEqual(actual, entry);
  });

  it("debit의 1개가 입력되지 않은 경우", () => {
    const lines_debit: JournalLine_Debit[] = [
      { _tag: "debit", account: "853000", debit: 7740, commodity: "KRW" },
      { _tag: "debit", account: "854000", debit: 0, commodity: "KRW" },
    ];
    const lines_credit: JournalLine_Credit[] = [
      { _tag: "credit", account: "102101", credit: 15480, commodity: "KRW" },
    ];

    const entry: JournalEntry = {
      ...example,
      lines_debit,
      lines_credit,
    };
    const actual = JournalEntry.derive(entry);
    assert.deepStrictEqual(actual, example);
  });

  it("credit의 1개가 입력되지 않은 경우", () => {
    const lines_debit: JournalLine_Debit[] = [
      { _tag: "debit", account: "853000", debit: 7740, commodity: "KRW" },
      { _tag: "debit", account: "854000", debit: 7740, commodity: "KRW" },
    ];
    const lines_credit: JournalLine_Credit[] = [
      { _tag: "credit", account: "102101", credit: 0, commodity: "KRW" },
    ];

    const entry: JournalEntry = {
      ...example,
      lines_debit,
      lines_credit,
    };
    const actual = JournalEntry.derive(entry);
    assert.deepStrictEqual(actual, example);
  });
});
