// import { engine } from "../instances.js";
import { MyRequest } from "../networks/types.js";
import { createHonoApp } from "./helpers.js";
import { LedgerController as Controller } from "./mod.js";

export const app = createHonoApp();

/*
app.get("/", async (c) => {
  const html = await engine.renderFile("ledgers/ledger_index", {});
  return c.html(html);
});
*/

app.get("/list", async (c) => {
  const { db } = c.env;
  const body = Controller.ListReq.parse(c.req.query());
  const req = new MyRequest(body, { db });
  const resp = await Controller.list(req);
  return c.json(resp);
});

export const path = "/api/ledger" as const;
