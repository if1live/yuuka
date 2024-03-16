import { Hono } from "hono";
import { sql } from "kysely";
import { db } from "../db.js";

const app = new Hono();

/** /status */
app.get("/", async (c) => {
  type Row = { version: unknown; now: unknown };
  const compiledQuery =
    sql<Row>`SELECT VERSION() AS version, NOW() AS now`.compile(db);
  const output = await db.executeQuery(compiledQuery);
  return c.json(output.rows);
});

export const StatusController = {
  path: "/status" as const,
  app,
};
