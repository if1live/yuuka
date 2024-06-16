import * as R from "remeda";
import { Result } from "true-myth";
import { z } from "zod";
import { DateOnly } from "../core/types.js";
import { JournalLine } from "./JournalLine.js";

const schema = z.object({
  id: z.string(),
  date: DateOnly.schema,
  brief: z.string(),
  lines_debit: z.array(JournalLine.debit_schema).min(1),
  lines_credit: z.array(JournalLine.credit_schema).min(1),
});

export type JournalEntry = z.infer<typeof schema>;

const validate = (journal: JournalEntry): JournalEntry => {
  const lines_debit = journal.lines_debit.map(JournalLine.validate_debit);
  const lines_credit = journal.lines_credit.map(JournalLine.validate_credit);

  if (lines_debit.length === 0) throw new Error("lines_debit is empty");
  if (lines_credit.length === 0) throw new Error("lines_credit is empty");

  const debit = R.sumBy(lines_debit, (x) => x.debit);
  const credit = R.sumBy(lines_credit, (x) => x.credit);

  if (debit !== credit) {
    throw new Error(`debit(${debit}) !== credit(${credit})`);
  }

  return {
    ...journal,
    lines_debit,
    lines_credit,
  };
};

const safeValidate = (journal: JournalEntry): Result<JournalEntry, Error> => {
  try {
    return Result.ok(validate(journal));
  } catch (e) {
    return Result.err(e as Error);
  }
};

export const JournalEntry = {
  schema,
  validate,
  safeValidate,
};
