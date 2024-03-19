import { faker } from "@faker-js/faker";
import { JournalEntryLineSchema, JournalEntrySchema } from "@yuuka/db";
import { assert, afterAll, beforeAll, describe, expect, it } from "vitest";
import { JournalEntryRepository } from "../../src/journals/JournalEntryRepository.js";
import { TestDatabase } from "../mod.js";

describe("JournalEntryRepository", () => {
  const db = TestDatabase.create();

  const entryId = faker.string.alphanumeric(8);

  beforeAll(async () => {
    await TestDatabase.synchronize(db);

    const entry: JournalEntrySchema.NewRow = {
      entryId,
      date: "2024-03-01",
      brief: faker.lorem.sentence(),
    };
    await db.insertInto(JournalEntrySchema.name).values(entry).execute();

    const skel = { entryId };
    const { debitTag, creditTag } = JournalEntryLineSchema;
    const lines: JournalEntryLineSchema.NewRow[] = [
      { ...skel, code: 102, tag: debitTag, amount: 100 },
      { ...skel, code: 103, tag: creditTag, amount: 100 },
    ];
    await db.insertInto(JournalEntryLineSchema.name).values(lines).execute();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it("findById: exists", async () => {
    const entry = await JournalEntryRepository.findById(db, entryId);
    assert.strictEqual(entry.lines.length, 2);
  });

  it("findById: not exists", async () => {
    expect(() =>
      JournalEntryRepository.findById(db, "invalid"),
    ).rejects.toThrow();
  });

  it("findByDateRange: exists", async () => {
    const entries = await JournalEntryRepository.findByDateRange(db, {
      start: "2024-03-01",
      end: "2024-03-02",
    });
    assert.strictEqual(entries.length, 1);
  });

  it("findByDateRange: not exists", async () => {
    const entries = await JournalEntryRepository.findByDateRange(db, {
      start: "2024-03-02",
      end: "2024-03-03",
    });
    assert.strictEqual(entries.length, 0);
  });
});
