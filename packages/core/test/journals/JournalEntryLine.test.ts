import { assert, describe, it } from "vitest";
import { JournalEntryLine } from "../../src/journals/JournalEntryLine.js";

describe("JournalEntryLine", () => {
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
