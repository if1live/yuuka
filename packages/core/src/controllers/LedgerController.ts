import { Hono } from "hono";
import { db } from "../db.js";
import { AccountCode } from "../index.js";
import { MyResponse } from "../networks/index.js";
import type { AsControllerFn } from "../networks/rpc.js";
import { ledgerSpecification } from "../specifications/index.js";
import { registerHandler } from "./helpers.js";

const sheet = ledgerSpecification.dataSheet;
type Sheet = typeof sheet;

const list: AsControllerFn<Sheet["list"]> = async (req) => {
  // TODO: 기간도 넣어야할듯
  const body = req.body;
  const code = body.code < 1000 ? body.code * 1000 : body.code;

  const tagCode = AccountCode.toTag(code);
  const isTag = tagCode * 1000 === code;

  const load_plain = async () => {
    return await db
      .selectFrom("journalEntryLine")
      .selectAll()
      .where("code", "=", code)
      .execute();
  };

  const load_group = async () => {
    return await db
      .selectFrom("journalEntryLine")
      .selectAll()
      .where("code", ">=", tagCode * 1000)
      .where("code", "<", (tagCode + 1) * 1000)
      .execute();
  };

  const lines = isTag ? await load_group() : await load_plain();
  if (lines.length <= 0) {
    return new MyResponse({
      code,
      ledgers: [],
    });
  }

  const ids = lines.map((line) => line.entry_id);
  const rows = await db
    .selectFrom("journalEntry")
    .selectAll()
    .where("id", "in", ids)
    .execute();
  const entryMap = new Map(rows.map((row) => [row.id, row]));

  return new MyResponse({
    code,
    ledgers: lines.map((line) => {
      const entry = entryMap.get(line.entry_id);
      return {
        id: line.entry_id,
        brief: entry?.brief ?? "<unknwon>",
        date: entry?.date ?? "1970-01-01",
        debit: line.debit,
        credit: line.credit,
      };
    }),
  });
};

const app = new Hono();
registerHandler(app, sheet.list, list);

export const LedgerController = {
  app,
};
