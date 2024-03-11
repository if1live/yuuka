import { Hono } from "hono";
import { db } from "../db.js";
import { JournalEntryRepository } from "../journals/JournalEntryRepository.js";
import { MyResponse } from "../networks/index.js";
import type { AsControllerFn } from "../networks/rpc.js";
import { journalSpecification } from "../specifications/index.js";
import { registerHandler } from "./helpers.js";

const sheet = journalSpecification.dataSheet;
type Sheet = typeof sheet;

const list: AsControllerFn<Sheet["list"]> = async (req) => {
  const { startDate, endDate } = req.body;
  const entries = await JournalEntryRepository.findByDateRange(
    db,
    startDate,
    endDate,
  );
  return new MyResponse({ entries });
};

const get: AsControllerFn<Sheet["get"]> = async (req) => {
  const { id } = req.body;
  const found = await JournalEntryRepository.findById(db, id);
  return new MyResponse(found);
};

const app = new Hono();
registerHandler(app, sheet.list, list);
registerHandler(app, sheet.get, get);

export const JournalController = {
  path: journalSpecification.resource,
  app,
};
