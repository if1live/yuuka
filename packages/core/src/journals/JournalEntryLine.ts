import { JournalEntryLineSchema } from "@yuuka/db";

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

type JournalEntryLine_Any = {
  _tag?: undefined;
  code: number;
  debit: number | null;
  credit: number | null;
};

export type JournalEntryLine =
  | JournalEntryLine_Debit
  | JournalEntryLine_Credit
  | JournalEntryLine_Any;

const cast_any = (
  line: JournalEntryLine_Any,
): JournalEntryLine_Debit | JournalEntryLine_Credit => {
  if (line.debit) {
    return {
      _tag: "debit",
      code: line.code,
      debit: line.debit,
    };
  }

  if (line.credit) {
    return {
      _tag: "credit",
      code: line.code,
      credit: line.credit,
    };
  }

  throw new Error("unreachable");
};

const cast = (line: JournalEntryLine) => {
  switch (line._tag) {
    case "debit":
    case "credit":
      return line;
    default:
      return cast_any(line);
  }
};

const validate_debit = (line: JournalEntryLine_Debit): JournalEntryLine => {
  if (line.debit <= 0) throw new Error("debit is not positive");

  return line;
};

const validate_credit = (line: JournalEntryLine_Credit): JournalEntryLine => {
  if (line.credit <= 0) throw new Error("credit is not positive");

  return line;
};

const validate_any = (line: JournalEntryLine_Any): JournalEntryLine => {
  if (line.debit === null && line.credit === null) {
    throw new Error("debit and credit are null");
  }
  if (line.debit && line.credit) {
    throw new Error("debit and credit exists");
  }

  const next = cast_any(line);
  switch (next._tag) {
    case "debit":
      return validate_debit(next);
    case "credit":
      return validate_credit(next);
  }
};

const validate = (line: JournalEntryLine) => {
  switch (line._tag) {
    case "debit":
      return validate_debit(line);
    case "credit":
      return validate_credit(line);
    default:
      return validate_any(line);
  }
};

const compare = (a: JournalEntryLine, b: JournalEntryLine): number => {
  // 같은 계열에서는 코드 기준
  if (a._tag && b._tag && a._tag === b._tag) {
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
    const next = cast(line);
    if (next._tag === "debit") {
      results.push(next);
    }
  }
  return results;
};

const filter_credit = (
  lines: JournalEntryLine[],
): JournalEntryLine_Credit[] => {
  const results = [];
  for (const line of lines) {
    const next = cast(line);
    if (next._tag === "credit") {
      results.push(next);
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
  cast,
  validate,
  compare,
  filter_debit,
  filter_credit,
  fromRow,
};
