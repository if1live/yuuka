import { Hono } from "hono";
import { nanoid } from "nanoid";
import { AccessTokenHelper } from "../helpers/tokens.js";
import { db } from "../instances/database.js";
import type { JournalEntry } from "../ledgers/JournalEntry.js";
import { LedgerRepository } from "../repositories/index.js";

const app = new Hono();

app.get("/list", async (c) => {
  const userId = AccessTokenHelper.extractOrThrow(c);
  const entries = await LedgerRepository.find(db, userId);
  return c.json(entries);
});

app.post("/create/:txid", async (c) => {
  const userId = AccessTokenHelper.extractOrThrow(c);
  const json = await c.req.json();

  // API 문제를 될수있는한 피하려고 txid는 임의로 생성
  const transactionId = nanoid();
  const entry: JournalEntry = {
    ...json,
    id: transactionId,
  };
  const rows = await LedgerRepository.insert(db, userId, entry);
  return c.json(entry);
});

app.post("/remove/:txid", async (c) => {
  const txid = c.req.param("txid");
  const userId = AccessTokenHelper.extractOrThrow(c);

  const result = await LedgerRepository.remove(db, userId, txid);
  return c.json(result);
});

export const LedgerApp = {
  prefix: "/api/ledger" as const,
  app,
};
