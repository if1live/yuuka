import { Hono } from "hono";
import * as R from "remeda";
import { db } from "../db.js";
import type { JournalEntry } from "../index.js";
import { MyResponse } from "../networks/index.js";
import type { AsControllerFn } from "../networks/rpc.js";
import { journalSpecification } from "../specifications/index.js";
import { registerHandler } from "./helpers.js";

const sheet = journalSpecification.dataSheet;
type Sheet = typeof sheet;

const list: AsControllerFn<Sheet["list"]> = async (req) => {
  const { startDate, endDate } = req.body;

  // TODO: join으로 바꿀 수 있을듯?
  const rows = await db
    .selectFrom("journalEntry")
    .selectAll()
    .where("date", ">=", startDate)
    .where("date", "<", endDate)
    .execute();

  if (rows.length === 0) {
    return new MyResponse({
      entries: [],
    });
  }

  const ids = rows.map((x) => x.id);
  const lines = await db
    .selectFrom("journalEntryLine")
    .selectAll()
    .where("entry_id", "in", ids)
    .execute();

  const group = R.groupBy(lines, (x) => x.entry_id);
  const entries = rows.map((entry): JournalEntry => {
    const chunk = group[entry.id] ?? [];
    return {
      ...entry,
      lines: chunk,
    };
  });

  return new MyResponse({
    entries,
  });
};

const get: AsControllerFn<Sheet["get"]> = async (req) => {
  const { id } = req.body;

  // TODO:: join으로 바꿀 수 있을듯
  const entry = await db
    .selectFrom("journalEntry")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirstOrThrow();

  const lines = await db
    .selectFrom("journalEntryLine")
    .selectAll()
    .where("entry_id", "=", id)
    .execute();

  return new MyResponse({
    id: entry.id,
    brief: entry.brief,
    date: entry.date,
    lines: lines,
  });
};

const app = new Hono();
registerHandler(app, sheet.list, list);
registerHandler(app, sheet.get, get);

export const JournalController = {
  app,
};
