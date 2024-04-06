import { LedgerTransactionTable } from "../../tables/index.js";

type JournalLine_Debit = {
  _tag: "debit";
  code: number;
  debit: number;
};

type JournalLine_Credit = {
  _tag: "credit";
  code: number;
  credit: number;
};

export type JournalLine = JournalLine_Debit | JournalLine_Credit;

const validate_debit = (line: JournalLine_Debit): JournalLine => {
  if (line.debit <= 0) throw new Error("debit is not positive");

  return line;
};

const validate_credit = (line: JournalLine_Credit): JournalLine => {
  if (line.credit <= 0) throw new Error("credit is not positive");

  return line;
};

const validate = (line: JournalLine) => {
  switch (line._tag) {
    case "debit":
      return validate_debit(line);
    case "credit":
      return validate_credit(line);
  }
};

const compare = (a: JournalLine, b: JournalLine): number => {
  // 같은 계열에서는 코드 기준
  if (a._tag === b._tag) {
    return a.code - b.code;
  }

  // debit -> credit
  if (a._tag === "debit" && b._tag === "credit") return -1;
  if (a._tag === "credit" && b._tag === "debit") return 1;
  return 0;
};

const filter_debit = (lines: JournalLine[]): JournalLine_Debit[] => {
  const results = [];
  for (const line of lines) {
    if (line._tag === "debit") {
      results.push(line);
    }
  }
  return results;
};

const filter_credit = (lines: JournalLine[]): JournalLine_Credit[] => {
  const results = [];
  for (const line of lines) {
    if (line._tag === "credit") {
      results.push(line);
    }
  }
  return results;
};

const fromRow = (x: LedgerTransactionTable.Row): JournalLine => {
  switch (x.tag) {
    case LedgerTransactionTable.debitTag:
      return { _tag: "debit", code: x.code, debit: x.amount };
    case LedgerTransactionTable.creditTag:
      return { _tag: "credit", code: x.code, credit: x.amount };
  }
};

export const JournalLine = {
  validate,
  compare,
  filter_debit,
  filter_credit,
  fromRow,
};
