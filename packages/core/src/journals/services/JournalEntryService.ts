import {
  type AccountTransactionSchema,
  LedgerTransactionSchema,
} from "../../tables/index.js";
import type { JournalEntry } from "../models/JournalEntry.js";

/**
 * journal entry 여러개를 한번에 넣게 하려면 변환과 insert를 나눌수 있어야한다.
 */
const prepare = (
  input: JournalEntry,
): {
  entries: AccountTransactionSchema.NewRow[];
  lines: LedgerTransactionSchema.NewRow[];
} => {
  const entry: AccountTransactionSchema.NewRow = {
    entryId: input.id,
    date: input.date,
    brief: input.brief,
  };

  const lines = input.lines.map((line): LedgerTransactionSchema.NewRow => {
    switch (line._tag) {
      case "credit":
        return {
          entryId: input.id,
          code: line.code,
          tag: LedgerTransactionSchema.creditTag,
          amount: line.credit,
        };
      case "debit":
        return {
          entryId: input.id,
          code: line.code,
          tag: LedgerTransactionSchema.debitTag,
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
