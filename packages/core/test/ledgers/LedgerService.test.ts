import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { JournalEntry } from "../../src/journals/models/JournalEntry.js";
import { LedgerTransactionRepository } from "../../src/journals/repositories/LedgerTransactionRepository.js";
import { AccountTransactionRepository } from "../../src/journals/repositories/AccountTransactionRepository.js";
import { JournalEntryService } from "../../src/journals/services/JournalEntryService.js";
import { LedgerService } from "../../src/ledgers/LedgerService.js";
import { TestDatabase } from "../TestDatabase.js";

describe("LedgerService", () => {
  const journal: JournalEntry = {
    id: "1",
    brief: "brief",
    date: "2024-03-01",
    lines: [
      { _tag: "debit", code: 101_001, debit: 100 },
      { _tag: "debit", code: 101_002, debit: 200 },
    ],
  };

  const db = TestDatabase.create();

  beforeAll(async () => {
    await TestDatabase.synchronize(db);

    const data = JournalEntryService.prepare(journal);
    await AccountTransactionRepository.insertBulk(db, data.entries);
    await LedgerTransactionRepository.insertBulk(db, data.lines);
  });

  afterAll(async () => {
    await db.destroy();
  });

  it("code: 101_001", async () => {
    const code = 101_001;
    const ledgers = await LedgerService.load(db, code, {
      start: "2024-01-01",
      end: "2024-12-31",
    });
    expect(ledgers).toHaveLength(1);
  });

  it("code: 101_000", async () => {
    const code = 101_000;
    const ledgers = await LedgerService.load(db, code, {
      start: "2024-01-01",
      end: "2024-12-31",
    });
    expect(ledgers).toHaveLength(2);
  });
});
