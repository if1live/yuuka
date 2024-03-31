import { JournalEntryLineSchema } from "../tables/index.js";

type JournalEntryLine_Debit = {
  _tag: "debit";
  code: number;
  debit: number;
};

type JournalEntryLine_Credit = {
  _tag: "credit";
  code: number;
  credit: number;
};

export type JournalEntryLine = JournalEntryLine_Debit | JournalEntryLine_Credit;

const validate_debit = (line: JournalEntryLine_Debit): JournalEntryLine => {
  if (line.debit <= 0) throw new Error("debit is not positive");

  return line;
};

const validate_credit = (line: JournalEntryLine_Credit): JournalEntryLine => {
  if (line.credit <= 0) throw new Error("credit is not positive");

  return line;
};

const validate = (line: JournalEntryLine) => {
  switch (line._tag) {
    case "debit":
      return validate_debit(line);
    case "credit":
      return validate_credit(line);
  }
};

const compare = (a: JournalEntryLine, b: JournalEntryLine): number => {
  // 같은 계열에서는 코드 기준
  if (a._tag === b._tag) {
    return a.code - b.code;
  }

  // debit -> credit
  if (a._tag === "debit" && b._tag === "credit") return -1;
  if (a._tag === "credit" && b._tag === "debit") return 1;
  return 0;
};

const filter_debit = (lines: JournalEntryLine[]): JournalEntryLine_Debit[] => {
  const results = [];
  for (const line of lines) {
    if (line._tag === "debit") {
      results.push(line);
    }
  }
  return results;
};

const filter_credit = (
  lines: JournalEntryLine[],
): JournalEntryLine_Credit[] => {
  const results = [];
  for (const line of lines) {
    if (line._tag === "credit") {
      results.push(line);
    }
  }
  return results;
};

const fromRow = (x: JournalEntryLineSchema.Row): JournalEntryLine => {
  switch (x.tag) {
    case JournalEntryLineSchema.debitTag:
      return { _tag: "debit", code: x.code, debit: x.amount };
    case JournalEntryLineSchema.creditTag:
      return { _tag: "credit", code: x.code, credit: x.amount };
  }
};

export const JournalEntryLine = {
  validate,
  compare,
  filter_debit,
  filter_credit,
  fromRow,
};
