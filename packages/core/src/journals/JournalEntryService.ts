import { JournalEntryLineSchema, type JournalEntrySchema } from "@yuuka/db";
import type { JournalEntry } from "./JournalEntry.js";

/**
 * journal entry 여러개를 한번에 넣게 하려면 변환과 insert를 나눌수 있어야한다.
 */
const prepare = (
  input: JournalEntry,
): {
  entries: JournalEntrySchema.NewRow[];
  lines: JournalEntryLineSchema.NewRow[];
} => {
  const entry: JournalEntrySchema.NewRow = {
    entryId: input.id,
    date: input.date,
    brief: input.brief,
  };

  const lines = input.lines.map((line): JournalEntryLineSchema.NewRow => {
    switch (line._tag) {
      case "credit":
        return {
          entryId: input.id,
          code: line.code,
          tag: JournalEntryLineSchema.creditTag,
          amount: line.credit,
        };
      case "debit":
        return {
          entryId: input.id,
          code: line.code,
          tag: JournalEntryLineSchema.debitTag,
          amount: line.debit,
        };
    }
  });

  return {
    entries: [entry],
    lines,
  };
};

export const JournalEntryService = {
  prepare,
};
