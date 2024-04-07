import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Journal } from "../../../src/journals/models/Journal.js";
import {
  AccountTransactionRepository,
  LedgerTransactionRepository,
} from "../../../src/journals/repositories/index.js";
import { JournalService } from "../../../src/journals/services/index.js";
import { LedgerService } from "../../../src/ledgers/services/index.js";
import { KyselyHelper } from "../../../src/rdbms/index.js";

describe("LedgerService", () => {
  const journal: Journal = {
    id: "1",
    brief: "brief",
    date: "2024-03-01",
    lines_debit: [{ _tag: "debit", code: 101_001, debit: 100 }],
    lines_credit: [{ _tag: "credit", code: 101_002, credit: 200 }],
  };

  const { db } = KyselyHelper.fromEmpty({});

  beforeAll(async () => {
    await KyselyHelper.createSchema(db);

    const data = JournalService.prepare(journal);
    await AccountTransactionRepository.insertBulk(db, data.accounts);
    await LedgerTransactionRepository.insertBulk(db, data.ledgers);
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
