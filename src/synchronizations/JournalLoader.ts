import fs from "node:fs/promises";
import path from "node:path";
import * as csv from "csv/sync";
import * as R from "remeda";
import { z } from "zod";
import { dateSchema } from "../core/types.js";
import type { Journal } from "../journals/models/Journal.js";
import { JournalLine } from "../journals/models/JournalLine.js";
import { parseFileName } from "./helpers.js";

const journalItemSchema = z.object({
  date: dateSchema,
  txid: z.string(),
  brief: z.string(),
  code: z.coerce.number(),
  debit: z.coerce.number().nullable(),
  credit: z.coerce.number().nullable(),
});
export type JournalItemRecord = z.infer<typeof journalItemSchema>;

const parseJournalSheet = (
  input: string,
  year: number,
  month: number,
): JournalItemRecord[] => {
  const records = csv.parse(input, {
    // 첫줄 버리고 시작
    from_line: 2,
    skip_empty_lines: true,
  });

  // 메타데이터는 대표 entry에만 채울거다.
  // 비어있으면 연속된 entry로 취급
  let latest_day = 0;
  let latest_txid = "";
  let latest_brief = "";

  const daySchema = z.coerce.number();

  const items = [];
  for (const record of records) {
    const [
      candidate_month,
      candidate_day,
      candidate_txid,
      candidate_brief,
      candidate_code,
      candidate_debit,
      candidate_credit,
    ] = record;

    const selectCell = <T>(candiate: string, latest: T): string | T => {
      return candiate !== "" ? candiate : latest;
    };

    // TODO: 날짜 처리 더 좋은거 있나? "일"보다 작은 단위는 없어도 되겠지?
    const day = R.pipe(selectCell(candidate_day, latest_day), (x) =>
      daySchema.parse(x),
    );

    const mm = `${month}`.padStart(2, "0");
    const dd = `${day}`.padStart(2, "0");
    const date = `${year}-${mm}-${dd}`;

    const skel = {
      date,
      txid: selectCell(candidate_txid, latest_txid),
      brief: selectCell(candidate_brief, latest_brief),
      code: candidate_code,
      debit: candidate_debit !== "" ? candidate_debit : null,
      credit: candidate_credit !== "" ? candidate_credit : null,
    };
    const item = journalItemSchema.parse(skel);

    latest_day = day;

    latest_txid = item.txid;
    latest_brief = item.brief;

    items.push(item);
  }
  return items;
};

const group = (records: JournalItemRecord[]) => {
  // group 기준으로는 거래번호
  const result = R.groupBy(records, (x) => x.txid);
  return result;
};

const convert = (records: [JournalItemRecord, ...JournalItemRecord[]]) => {
  const [first, ...rest] = records;

  const lines = records.map((record): JournalLine => {
    if (record.debit) {
      return {
        _tag: "debit",
        code: record.code,
        debit: record.debit,
      };
    }

    if (record.credit) {
      return {
        _tag: "credit",
        code: record.code,
        credit: record.credit,
      };
    }

    // else...
    throw new Error("invalid record");
  });

  const lines_debit = JournalLine.filter_debit(lines);
  const lines_credit = JournalLine.filter_credit(lines);

  const entry: Journal = {
    date: first.date,
    id: first.txid,
    brief: first.brief,
    lines_debit,
    lines_credit,
  };
  return entry;
};

type RecordContext = {
  ymd: { year: number; month: number };
  records: JournalItemRecord[];
};

const convertRoot = (context: RecordContext) => {
  const { records } = context;
  const groups = group(records);
  const entries = R.map(Object.values(groups), convert);
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
  const records = parseJournalSheet(text, ymd.year, ymd.month);
  return { ymd, records };
};

export const JournalLoader = {
  read: readRoot,
  convert: convertRoot,
};
