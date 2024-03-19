import type { KyselyDB } from "@yuuka/db";
import { Hono } from "hono";
import { LedgerService } from "../ledgers/LedgerService.js";
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

  const startDate = "1970-01-01";
  const endDate = "9999-12-31";

  const ledgers = await LedgerService.load(req.db, code, {
    start: startDate,
    end: endDate,
  });

  return new MyResponse({
    code,
    ledgers,
  });
};

const createApp = (db: KyselyDB) => {
  const app = new Hono();
  registerHandler(app, db, sheet.list, list);
  return app;
};

export const LedgerController = {
  path: ledgerSpecification.resource,
  createApp,
};
