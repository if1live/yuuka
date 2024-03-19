import type { Database } from "@yuuka/db";
import { Hono } from "hono";
import type { Kysely } from "kysely";
import { JournalEntryRepository } from "../journals/JournalEntryRepository.js";
import { MyResponse } from "../networks/index.js";
import type { AsControllerFn } from "../networks/rpc.js";
import { journalSpecification } from "../specifications/index.js";
import { registerHandler } from "./helpers.js";

const sheet = journalSpecification.dataSheet;
type Sheet = typeof sheet;

const list: AsControllerFn<Sheet["list"]> = async (req) => {
  const { startDate, endDate } = req.body;
  const entries = await JournalEntryRepository.findByDateRange(req.db, {
    start: startDate,
    end: endDate,
  });
  return new MyResponse({ entries });
};

const get: AsControllerFn<Sheet["get"]> = async (req) => {
  const { id } = req.body;
  const found = await JournalEntryRepository.findById(req.db, id);
  return new MyResponse(found);
};

const create: AsControllerFn<Sheet["create"]> = async (req) => {
  const body = req.body;
  console.log(JSON.stringify(body, null, 2));
  return new MyResponse(body);
};

const edit: AsControllerFn<Sheet["edit"]> = async (req) => {
  const body = req.body;
  console.log(JSON.stringify(body, null, 2));
  return new MyResponse(body);
};

const createApp = (db: Kysely<Database>) => {
  const app = new Hono();
  registerHandler(app, db, sheet.list, list);
  registerHandler(app, db, sheet.get, get);
  registerHandler(app, db, sheet.create, create);
  registerHandler(app, db, sheet.edit, edit);
  return app;
};

export const JournalController = {
  path: journalSpecification.resource,
  createApp,
};
