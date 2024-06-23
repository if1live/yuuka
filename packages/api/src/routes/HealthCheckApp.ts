import { Hono } from "hono";
import { sql } from "kysely";
import { db } from "../instances/database.js";
import { settings } from "../settings/index.js";

const app = new Hono();

app.get("/release", async (c) => {
  const data = {
    GIT_COMMIT: settings.GIT_COMMIT,
    GIT_BRANCH: settings.GIT_BRANCH,
  };
  return c.json(data);
});

app.get("/db", async (c) => {
  type Row = { v: number };
  const compiledQuery = sql<Row>`select 1+2 as v`.compile(db);
  const output = await db.executeQuery(compiledQuery);
  const row = output.rows[0];
  return c.json(row);
});

export const HealthCheckApp = {
  prefix: "/healthcheck" as const,
  app,
};
