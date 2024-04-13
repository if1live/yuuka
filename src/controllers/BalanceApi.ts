import { MyRequest } from "../networks/types.js";
import { createHonoApp } from "./helpers.js";
import { BalanceController as Controller } from "./mod.js";

export const app = createHonoApp();

app.get("/trial-balance/:date", async (c) => {
  const { db } = c.env;
  const body = Controller.TrialBalanceReq.parse({
    date: c.req.param("date"),
  });
  const req = new MyRequest(body, { db });
  const resp = await Controller.trialBalance(req);
  return c.json(resp);
});

app.get("/:code/:date", async (c) => {
  const { db } = c.env;
  const body = Controller.GetReq.parse({
    code: c.req.param("code"),
    date: c.req.param("date"),
  });
  const req = new MyRequest(body, { db });
  const resp = await Controller.get(req);
  return c.json(resp);
});

export const path = "/api/balance" as const;
