import { faker } from "@faker-js/faker";
import type { Insertable } from "kysely";
import { assert, afterAll, beforeAll, describe, expect, it } from "vitest";
import { createDialect, createKysely, prepareSchema } from "../../src/db.js";
import { JournalEntryRepository } from "../../src/journals/JournalEntryRepository.js";
import type {
  JournalEntryLineTable,
  JournalEntryTable,
} from "../../src/tables.js";

describe("JournalEntryRepository", () => {
  const dialect = createDialect(":memory:");
  const db = createKysely(dialect);

  const id = faker.string.alphanumeric(8);

  beforeAll(async () => {
    await prepareSchema(db);

    const entry: Insertable<JournalEntryTable> = {
      id,
      date: "2024-03-01",
      brief: faker.lorem.sentence(),
    };
    await db.insertInto("journalEntry").values(entry).execute();

    const lines: Insertable<JournalEntryLineTable>[] = [
      { entry_id: id, code: 102, debit: 100, credit: 0 },
      { entry_id: id, code: 103, debit: 0, credit: 100 },
    ];
    await db.insertInto("journalEntryLine").values(lines).execute();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it("findById: exists", async () => {
    const entry = await JournalEntryRepository.findById(db, id);
    assert.strictEqual(entry.lines.length, 2);
  });

  it("findById: not exists", async () => {
    expect(() =>
      JournalEntryRepository.findById(db, "invalid"),
    ).rejects.toThrow();
  });

  it("findByDateRange: exists", async () => {
    const entries = await JournalEntryRepository.findByDateRange(
      db,
      "2024-03-01",
      "2024-03-02",
    );
    assert.strictEqual(entries.length, 1);
  });

  it("findByDateRange: not exists", async () => {
    const entries = await JournalEntryRepository.findByDateRange(
      db,
      "2024-03-02",
      "2024-03-03",
    );
    assert.strictEqual(entries.length, 0);
  });
});
