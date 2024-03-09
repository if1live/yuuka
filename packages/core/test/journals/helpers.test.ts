import { assert, describe, it } from "vitest";
import { parseJournalFileName } from "../../src/journals/helpers.js";

describe("parseJournalFileName", () => {
  it("journal_2024_03.csv", () => {
    const filename = "journal_2024_03.csv";
    const actual = parseJournalFileName(filename);
    assert.strictEqual(actual.year, 2024);
    assert.strictEqual(actual.month, 3);
  });
});
