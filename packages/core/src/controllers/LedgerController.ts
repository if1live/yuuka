import { Hono } from "hono";
import { AccountStatementService } from "../accounts/AccountStatementService.js";
import { LedgerService } from "../ledgers/LedgerService.js";
import { MyResponse } from "../networks/index.js";
import type { AsControllerFn } from "../networks/rpc.js";
import { ledgerSpecification } from "../specifications/index.js";
import type { AccountStatementSchema, KyselyDB } from "../tables/index.js";
import { registerHandler } from "./helpers.js";

const sheet = ledgerSpecification.dataSheet;
type Sheet = typeof sheet;

const list: AsControllerFn<Sheet["list"]> = async (req) => {
  const body = req.body;
  const code = body.code < 1000 ? body.code * 1000 : body.code;
  const { startDate, endDate } = body;

  const ledgers = await LedgerService.load(req.db, code, {
    start: startDate,
    end: endDate,
  });

  const statement_found = await AccountStatementService.loadByPrimaryKey(
    req.db,
    code,
    startDate,
  );
  const statement: AccountStatementSchema.Row = statement_found ?? {
    code,
    date: startDate,
    closingBalance: 0,
    totalDebit: 0,
    totalCredit: 0,
  };

  return new MyResponse({
    code,
    statement,
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
