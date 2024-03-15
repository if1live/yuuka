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
  const permission = { userId: req.userId };
  const entries = await JournalEntryRepository.findByDateRange(db, permission, {
    start: startDate,
    end: endDate,
  });
  return new MyResponse({ entries });
};

const get: AsControllerFn<Sheet["get"]> = async (req) => {
  const { id } = req.body;
  const permission = { userId: req.userId };
  const found = await JournalEntryRepository.findById(db, permission, id);
  return new MyResponse(found);
};

const create: AsControllerFn<Sheet["create"]> = async (req) => {
  const body = req.body;
  const permission = { userId: req.userId };
  console.log(JSON.stringify(body, null, 2));
  return new MyResponse(body);
};

const edit: AsControllerFn<Sheet["edit"]> = async (req) => {
  const body = req.body;
  const permission = { userId: req.userId };
  console.log(JSON.stringify(body, null, 2));
  return new MyResponse(body);
};

const app = new Hono();
registerHandler(app, sheet.list, list);
registerHandler(app, sheet.get, get);
registerHandler(app, sheet.create, create);
registerHandler(app, sheet.edit, edit);

export const JournalController = {
  path: journalSpecification.resource,
  app,
};
