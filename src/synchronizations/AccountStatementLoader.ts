import fs from "node:fs/promises";
import path from "node:path";
import * as csv from "csv/sync";
import { z } from "zod";
import type { AccountStatementTable } from "../tables/index.js";
import { parseFileName } from "./helpers.js";

const accountStatementSchema = z.object({
  code: z.coerce.number(),
  date: z.string(),
  closingBalance: z.coerce.number(),
  totalDebit: z.coerce.number(),
  totalCredit: z.coerce.number(),
  description: z.string(),
});
type AccountStatementRecord = z.infer<typeof accountStatementSchema>;

const parseAccountStatementSheet = (
  input: string,
  year: number,
  month: number,
): AccountStatementRecord[] => {
  const records = csv.parse(input, {
    from_line: 2,
    skip_empty_lines: true,
  });

  const items = [];
  for (const record of records) {
    const [
      candidate_code,
      candidate_date,
      candidate_closingBalance,
      candidate_totalDebit,
      candidate_totalCredit,
      candidate_description,
    ] = record;

    // 각각의 CSV가 1개월의 상태를 정의하도록 했다.
    // 다른 입력이 들어가면 에러로 취급
    const mm = `${month}`.padStart(2, "0");
    const date = `${year}-${mm}-01`;
    if (date !== candidate_date)
      throw new Error(`invalid date: ${candidate_date}`);

    const row = accountStatementSchema.parse({
      code: candidate_code,
      date: candidate_date,
      closingBalance: candidate_closingBalance,
      totalDebit: candidate_totalDebit,
      totalCredit: candidate_totalCredit,
      description: candidate_description,
    });
    items.push(row);
  }

  return items;
};

const convert = (
  record: AccountStatementRecord,
): AccountStatementTable.NewRow => {
  return {
    code: record.code,
    date: record.date,
    closingBalance: record.closingBalance,
    totalDebit: record.totalDebit,
    totalCredit: record.totalCredit,
  };
};

type RecordContext = {
  ymd: { year: number; month: number };
  records: AccountStatementRecord[];
};

const convertRoot = (context: RecordContext) => {
  const entries = context.records.map(convert);
  return {
    ymd: context.ymd,
    entries,
  };
};

const readRoot = async (
  rootPath: string,
  filename: string,
): Promise<RecordContext> => {
  const ymd = parseFileName(filename);
  const fp = path.join(rootPath, filename);
  const text = await fs.readFile(fp, "utf8");
  const records = parseAccountStatementSheet(text, ymd.year, ymd.month);
  return { ymd, records };
};

export const AccountStatementLoader = {
  read: readRoot,
  convert: convertRoot,
};
