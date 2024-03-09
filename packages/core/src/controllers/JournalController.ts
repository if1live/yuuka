import { Hono } from "hono";
import { journalContext } from "../instances.js";
import { MyResponse } from "../networks/index.js";
import type { AsControllerFn } from "../networks/rpc.js";
import { journalSpecification } from "../specifications/index.js";
import { registerHandler } from "./helpers.js";

const sheet = journalSpecification.dataSheet;
type Sheet = typeof sheet;

const list: AsControllerFn<Sheet["list"]> = async (req) => {
  // TODO: db 기반으로 바꾸기
  const data = journalContext;

  const mm = data.ymd.month.toString().padStart(2, "0");
  const yymm = `${data.ymd.year}-${mm}`;

  return new MyResponse({
    ymd: yymm,
    entries: data.entries,
  });
};

const app = new Hono();
registerHandler(app, sheet.list, list);

export const JournalController = {
  app,
};
