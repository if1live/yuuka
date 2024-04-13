import * as R from "remeda";
import { Result } from "true-myth";
import { z } from "zod";
import { dateSchema } from "../../core/types.js";
import { JournalLine } from "./JournalLine.js";

const schema = z.object({
  id: z.string(),
  date: dateSchema,
  brief: z.string(),
  lines_debit: z.array(JournalLine.debit_schema).min(1),
  lines_credit: z.array(JournalLine.credit_schema).min(1),
});

export type Journal = z.infer<typeof schema>;

const validate = (journal: Journal): Journal => {
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

const safeValidate = (journal: Journal): Result<Journal, Error> => {
  try {
    return Result.ok(validate(journal));
  } catch (e) {
    return Result.err(e as Error);
  }
};

// TODO: csv 규격 생성은 다른곳으로 넘기는게 좋을듯
const toMat = (entry: Journal): unknown[][] => {
  // month,day,txid,brief,code,debit,credit
  const datetime = entry.date.split("-");
  const month = Number.parseInt(datetime[1] ?? "0");
  const day = Number.parseInt(datetime[2] ?? "0");

  const cells_metadata = [month, day, entry.id, entry.brief];
  const cells_padding = Array(cells_metadata.length).fill("");

  const rows_debit = entry.lines_debit.map((line, idx) => {
    const cells_amount = [line.code, line.debit, ""];
    return idx === 0
      ? [...cells_metadata, ...cells_amount]
      : [...cells_padding, ...cells_amount];
  });

  const rows_credit = entry.lines_credit.map((line) => {
    const cells_amount = [line.code, "", line.credit];
    return [...cells_padding, ...cells_amount];
  });

  const rows = [...rows_debit, ...rows_credit];
  return rows;
};

export const Journal = {
  schema,
  validate,
  safeValidate,
  toMat,
};
