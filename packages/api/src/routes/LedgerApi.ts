import { Hono } from "hono";
import { LedgerController } from "../controllers/index.js";
import { AccessTokenHelper } from "../helpers/tokens.js";
import { db } from "../instances/database.js";
import type { JournalEntry } from "../ledgers/JournalEntry.js";

export const app = new Hono();

app.get("/list", async (c) => {
  const userId = AccessTokenHelper.extractOrThrow(c);
  const result = await LedgerController.list(db, {
    userId,
  });
  return c.json(result);
});

app.post("/create/", async (c) => {
  const userId = AccessTokenHelper.extractOrThrow(c);
  const json = await c.req.json();
  const paylod = json as JournalEntry;

  const result = await LedgerController.create(db, userId, paylod);
  return c.json(result);
});

app.post("/remove/:txid", async (c) => {
  const txid = c.req.param("txid");
  const userId = AccessTokenHelper.extractOrThrow(c);
  const result = await LedgerController.remove(db, {
    userId,
    txid,
  });
  return c.json(result);
});

export const path = "/api/ledger" as const;
