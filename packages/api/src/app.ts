import { Hono } from "hono";
import { sql } from "kysely";
import { db } from "./instances/index.js";
import { settings } from "./settings/index.js";

export const app = new Hono();

app.get("/healthcheck/release", async (c) => {
  const data = {
    GIT_COMMIT: settings.GIT_COMMIT,
    GIT_BRANCH: settings.GIT_BRANCH,
  };
  return c.json(data);
});

app.get("/", async (c) => {
  return c.json({ ok: true });
});

app.get("/api/foo", async (c) => {
  type Row = { v: number };
  const compiledQuery = sql<Row>`select 1+2 as v`.compile(db);
  const output = await db.executeQuery(compiledQuery);
  const row = output.rows[0];
  return c.json(row);
});
