import * as R from "remeda";
import { Result } from "true-myth";
import { z } from "zod";
import { JournalLine } from "./JournalLine.js";

const schema = z.object({
  id: z.string(),
  date: z.string(),
  brief: z.string(),
  lines: z.array(JournalLine.schema).min(2),
});

export type Journal = z.infer<typeof schema>;

const validate = (journal: Journal): Journal => {
  const lines = journal.lines.map(JournalLine.validate);
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

const safeValidate = (journal: Journal): Result<Journal, Error> => {
  try {
    return Result.ok(validate(journal));
  } catch (e) {
    return Result.err(e as Error);
  }
};

// TODO: csv 규격 생성은 다른곳으로 넘기는게 좋을듯
const toCSV = (entry: Journal): unknown[][] => {
  // month,day,txid,brief,code,debit,credit
  const datetime = entry.date.split("-");
  const month = Number.parseInt(datetime[1] ?? "0");
  const day = Number.parseInt(datetime[2] ?? "0");

  const cells_metadata = [month, day, entry.id, entry.brief];
  const cells_padding = Array(cells_metadata.length).fill("");

  const rows = entry.lines.map((line, idx) => {
    const cells_amount =
      line._tag === "debit"
        ? [line.code, line.debit, ""]
        : [line.code, "", line.credit];

    return idx === 0
      ? [...cells_metadata, ...cells_amount]
      : [...cells_padding, ...cells_amount];
  });
  return rows;
};

export const Journal = {
  schema,
  validate,
  safeValidate,
  toCSV,
};
