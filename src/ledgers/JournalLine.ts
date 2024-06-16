import { z } from "zod";

const debit_schema = z.object({
  _tag: z.literal("debit"),
  account: z.string(),
  commodity: z.string(),
  debit: z.number(),
});

const credit_schema = z.object({
  _tag: z.literal("credit"),
  account: z.string(),
  commodity: z.string(),
  credit: z.number(),
});

const schema = z.union([debit_schema, credit_schema]);

export type JournalLine_Debit = z.infer<typeof debit_schema>;
export type JournalLine_Credit = z.infer<typeof credit_schema>;

export type JournalLine = JournalLine_Debit | JournalLine_Credit;

const validate_debit = (line: JournalLine_Debit): JournalLine_Debit => {
  if (line.debit <= 0) throw new Error("debit is not positive");

  return line;
};

const validate_credit = (line: JournalLine_Credit): JournalLine_Credit => {
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
    return a.account.localeCompare(b.account);
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

export const JournalLine = {
  schema,
  debit_schema,
  credit_schema,

  validate,
  validate_debit,
  validate_credit,
  compare,
  filter_debit,
  filter_credit,
};
