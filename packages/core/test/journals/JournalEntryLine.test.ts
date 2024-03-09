import { assert, describe, it } from "vitest";
import { JournalEntryLine } from "../../src/journals/JournalEntryLine.js";

describe("JournalEntryLine#validate", () => {
  it("ok: debit", () => {
    const line: JournalEntryLine = { _tag: "debit", code: 853000, debit: 1 };
    JournalEntryLine.validate(line);
  });

  it("ok: credit", () => {
    const line: JournalEntryLine = { _tag: "credit", code: 102101, credit: 1 };
    JournalEntryLine.validate(line);
  });

  it("fail: debit is negative", () => {
    const line: JournalEntryLine = { _tag: "debit", code: 853000, debit: -1 };
    assert.throws(() => JournalEntryLine.validate(line));
  });

  it("fail: credit is zero", () => {
    const line: JournalEntryLine = { _tag: "credit", code: 102101, credit: 0 };
    assert.throws(() => JournalEntryLine.validate(line));
  });

  it("fail: debit and credit are null", () => {
    const line: JournalEntryLine = { code: 102101, debit: null, credit: null };
    assert.throws(() => JournalEntryLine.validate(line));
  });

  it("fail: debit and credit exists", () => {
    const line: JournalEntryLine = { code: 102101, debit: 1, credit: 1 };
    assert.throws(() => JournalEntryLine.validate(line));
  });
});

describe("JournalEntryLine#compare", () => {
  it("대변/차변: debit -> credit", () => {
    const debit: JournalEntryLine = { _tag: "debit", code: 101, debit: 1 };
    const credit: JournalEntryLine = { _tag: "credit", code: 101, credit: 1 };
    const expected = [debit, credit];

    {
      const input = [debit, credit];
      const actual = input.sort(JournalEntryLine.compare);
      assert.deepStrictEqual(actual, expected);
    }
    {
      const input = [credit, debit];
      const actual = input.sort(JournalEntryLine.compare);
      assert.deepStrictEqual(actual, expected);
    }
  });

  it("동일 계열: code", () => {
    const code_101: JournalEntryLine = { _tag: "debit", code: 101, debit: 1 };
    const code_102: JournalEntryLine = { _tag: "debit", code: 102, debit: 1 };
    const expected = [code_101, code_102];

    {
      const input = [code_101, code_102];
      const actual = input.sort(JournalEntryLine.compare);
      assert.deepStrictEqual(actual, expected);
    }
    {
      const input = [code_102, code_101];
      const actual = input.sort(JournalEntryLine.compare);
      assert.deepStrictEqual(actual, expected);
    }
  });
});
