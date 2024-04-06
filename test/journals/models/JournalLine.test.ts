import { assert, describe, it } from "vitest";
import { JournalLine } from "../../../src/journals/models/JournalLine.js";

describe("JournalLine#validate", () => {
  it("ok: debit", () => {
    const line: JournalLine = { _tag: "debit", code: 853000, debit: 1 };
    JournalLine.validate(line);
  });

  it("ok: credit", () => {
    const line: JournalLine = { _tag: "credit", code: 102101, credit: 1 };
    JournalLine.validate(line);
  });

  it("fail: debit is negative", () => {
    const line: JournalLine = { _tag: "debit", code: 853000, debit: -1 };
    assert.throws(() => JournalLine.validate(line));
  });

  it("fail: credit is zero", () => {
    const line: JournalLine = { _tag: "credit", code: 102101, credit: 0 };
    assert.throws(() => JournalLine.validate(line));
  });
});

describe("JournalLine#compare", () => {
  it("대변/차변: debit -> credit", () => {
    const debit: JournalLine = { _tag: "debit", code: 101, debit: 1 };
    const credit: JournalLine = { _tag: "credit", code: 101, credit: 1 };
    const expected = [debit, credit];

    {
      const input = [debit, credit];
      const actual = input.sort(JournalLine.compare);
      assert.deepStrictEqual(actual, expected);
    }
    {
      const input = [credit, debit];
      const actual = input.sort(JournalLine.compare);
      assert.deepStrictEqual(actual, expected);
    }
  });

  it("동일 계열: code", () => {
    const code_101: JournalLine = { _tag: "debit", code: 101, debit: 1 };
    const code_102: JournalLine = { _tag: "debit", code: 102, debit: 1 };
    const expected = [code_101, code_102];

    {
      const input = [code_101, code_102];
      const actual = input.sort(JournalLine.compare);
      assert.deepStrictEqual(actual, expected);
    }
    {
      const input = [code_102, code_101];
      const actual = input.sort(JournalLine.compare);
      assert.deepStrictEqual(actual, expected);
    }
  });
});
