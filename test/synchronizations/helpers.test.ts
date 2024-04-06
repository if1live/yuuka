import { assert, describe, it } from "vitest";
import { parseFileName } from "../../src/synchronizations/helpers.js";

describe("parseJournalFileName", () => {
  it("journal_2024_03.csv", () => {
    const filename = "journal_2024_03.csv";
    const actual = parseFileName(filename);
    assert.strictEqual(actual.group, "journal");
    assert.strictEqual(actual.year, 2024);
    assert.strictEqual(actual.month, 3);
  });

  it("AccountStatement_2024_03.csv", () => {
    const filename = "AccountStatement_2024_03.csv";
    const actual = parseFileName(filename);
    assert.strictEqual(actual.group, "AccountStatement");
    assert.strictEqual(actual.year, 2024);
    assert.strictEqual(actual.month, 3);
  });
});
