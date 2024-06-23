import * as R from "remeda";
import { Result } from "true-myth";
import { z } from "zod";
import { DateOnly } from "../core/types.js";
import {
  JournalLine,
  type JournalLine_Credit,
  type JournalLine_Debit,
} from "./JournalLine.js";

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

const toLedger = (entry: JournalEntry) => {
  const line_brief = `${entry.date} ${entry.brief}`;
  const lines_debit = entry.lines_debit.map((line) => {
    return `    ${line.account}    ${line.debit} ${line.commodity}`;
  });
  const lines_credit = entry.lines_credit.map((line) => {
    return `    ${line.account}    -${line.credit} ${line.commodity}`;
  });
  const lines = [line_brief, ...lines_debit, ...lines_credit];
  const text = lines.join("\n");
  return text;
};

const swap = (entry: JournalEntry) => {
  const lines_debit = entry.lines_credit.map(
    (x): JournalLine_Debit => ({
      _tag: "debit",
      account: x.account,
      debit: x.credit,
      commodity: "KRW",
    }),
  );

  const lines_credit = entry.lines_debit.map(
    (x): JournalLine_Credit => ({
      _tag: "credit",
      account: x.account,
      credit: x.debit,
      commodity: "KRW",
    }),
  );

  return {
    ...entry,
    lines_debit,
    lines_credit,
  };
};

const remove = (entry: JournalEntry, account: string) => {
  const lines_debit = entry.lines_debit.filter((x) => x.account !== account);
  const lines_credit = entry.lines_credit.filter((x) => x.account !== account);
  return {
    ...entry,
    lines_debit,
    lines_credit,
  };
};

const derive = (entry: JournalEntry) => {
  const isBlankAmount = (x: number) => x === 0 || Number.isNaN(x);

  const blankLines_debit = entry.lines_debit.filter((x) =>
    isBlankAmount(x.debit),
  );
  const blankLines_credit = entry.lines_credit.filter((x) =>
    isBlankAmount(x.credit),
  );

  const blankLineCount = blankLines_credit.length + blankLines_debit.length;

  // 모든 수치가 정해져 있으면 작업이 필요없다.
  if (blankLineCount === 0) {
    return entry;
  }

  // 2개 이상의 항목이 비어있으면 값을 유도할수 없다.
  if (blankLineCount >= 2) {
    return entry;
  }

  const sum_debit = R.pipe(
    entry.lines_debit,
    R.filter((x) => !isBlankAmount(x.debit)),
    R.sumBy((x) => x.debit),
  );

  const sum_credit = R.pipe(
    entry.lines_credit,
    R.filter((x) => !isBlankAmount(x.credit)),
    R.sumBy((x) => x.credit),
  );

  // debit의 1개가 입력되지 않은 경우
  if (blankLines_debit.length === 1) {
    const rest = sum_credit - sum_debit;
    const lines_debit = entry.lines_debit.map((line) => {
      return isBlankAmount(line.debit) ? { ...line, debit: rest } : line;
    });
    return { ...entry, lines_debit };
  }

  // credit의 1개가 입력되지 않은 경우
  if (blankLines_credit.length === 1) {
    const rest = sum_debit - sum_credit;
    const lines_credit = entry.lines_credit.map((line) => {
      return isBlankAmount(line.credit) ? { ...line, credit: rest } : line;
    });
    return { ...entry, lines_credit };
  }

  return entry;
};

export const JournalEntry = {
  schema,
  validate,
  safeValidate,
  swap,
  remove,
  derive,
  toLedger,
};
