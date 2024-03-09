import { Result } from "neverthrow";
import * as R from "remeda";
import { JournalEntryLine } from "./JournalEntryLine.js";

export interface JournalEntry {
  id: string;
  date: string;
  brief: string;
  lines: JournalEntryLine[];
}

const validate = (journal: JournalEntry): JournalEntry => {
  const lines = journal.lines.map(JournalEntryLine.validate);
  if (lines.length === 0) throw new Error("lines is empty");

  const lines_credit = [];
  const lines_debit = [];
  for (const line of lines) {
    if (line._tag === "debit") {
      lines_debit.push(line);
    }
    if (line._tag === "credit") {
      lines_credit.push(line);
    }
  }

  const credit = R.sumBy(lines_credit, (x) => x.credit);
  const debit = R.sumBy(lines_debit, (x) => x.debit);

  if (credit !== debit) {
    throw new Error(`credit(${credit}) !== debit(${debit})`);
  }

  return {
    ...journal,
    lines,
  };
};

export const JournalEntry = {
  validate,
  safeValidate: Result.fromThrowable(validate, (e) => e as Error),
};
