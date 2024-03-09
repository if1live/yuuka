import { Hono } from "hono";
import { MyResponse } from "../networks/index.js";
import type { AsControllerFn } from "../networks/rpc.js";
import { ledgerSpecification } from "../specifications/index.js";
import { registerHandler } from "./helpers.js";

const sheet = ledgerSpecification.dataSheet;
type Sheet = typeof sheet;

const list: AsControllerFn<Sheet["list"]> = async (req) => {
  // TODO: db에서 읽기
  const { code } = req.body;
  return new MyResponse({
    code,
    ledgers: [],
  });
};

const app = new Hono();
registerHandler(app, sheet.list, list);

export const LedgerController = {
  app,
};
