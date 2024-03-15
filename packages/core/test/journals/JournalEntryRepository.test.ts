import { faker } from "@faker-js/faker";
import { JournalEntryLineSchema, JournalEntrySchema } from "@yuuka/db";
import { assert, afterAll, beforeAll, describe, expect, it } from "vitest";
import { JournalEntryRepository } from "../../src/journals/JournalEntryRepository.js";
import { TestDatabase } from "../mod.js";

describe("JournalEntryRepository", () => {
  const db = TestDatabase.create();

  const userId = faker.number.int();
  const entryId = faker.string.alphanumeric(8);
  const permission = { userId } as const;

  beforeAll(async () => {
    await TestDatabase.synchronize(db);

    const entry: JournalEntrySchema.NewRow = {
      userId,
      entryId,
      date: "2024-03-01",
      brief: faker.lorem.sentence(),
    };
    await db.insertInto(JournalEntrySchema.name).values(entry).execute();

    const lines: JournalEntryLineSchema.NewRow[] = [
      { userId, entryId, code: 102, debit: 100, credit: 0 },
      { userId, entryId, code: 103, debit: 0, credit: 100 },
    ];
    await db.insertInto(JournalEntryLineSchema.name).values(lines).execute();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it("findById: exists", async () => {
    const entry = await JournalEntryRepository.findById(
      db,
      permission,
      entryId,
    );
    assert.strictEqual(entry.lines.length, 2);
  });

  it("findById: not exists", async () => {
    expect(() =>
      JournalEntryRepository.findById(db, permission, "invalid"),
    ).rejects.toThrow();
  });

  it("findById: not mine", async () => {
    expect(() =>
      JournalEntryRepository.findById(db, { userId: 999 }, entryId),
    ).rejects.toThrow();
  });

  it("findByDateRange: exists", async () => {
    const entries = await JournalEntryRepository.findByDateRange(
      db,
      permission,
      { start: "2024-03-01", end: "2024-03-02" },
    );
    assert.strictEqual(entries.length, 1);
  });

  it("findByDateRange: not mine", async () => {
    const entries = await JournalEntryRepository.findByDateRange(
      db,
      { userId: 999 },
      { start: "2024-03-01", end: "2024-03-02" },
    );
    assert.strictEqual(entries.length, 0);
  });

  it("findByDateRange: not exists", async () => {
    const entries = await JournalEntryRepository.findByDateRange(
      db,
      permission,
      { start: "2024-03-02", end: "2024-03-03" },
    );
    assert.strictEqual(entries.length, 0);
  });
});
