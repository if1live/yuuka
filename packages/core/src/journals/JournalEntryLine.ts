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
  if (line.debit !== null && line.credit !== null) {
    throw new Error("debit and credit exists");
  }

  if (line.debit) {
    return validate_debit({
      ...line,
      _tag: "debit",
      code: line.code,
      debit: line.debit,
    });
  }

  if (line.credit) {
    return validate_credit({
      ...line,
      _tag: "credit",
      code: line.code,
      credit: line.credit,
    });
  }

  throw new Error("unreachable");
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

export const JournalEntryLine = {
  validate,
};
