import type { Database } from "@yuuka/db";
import { Hono } from "hono";
import { type Kysely, sql } from "kysely";

const createApp = (db: Kysely<Database>) => {
  const app = new Hono();

  /** /status */
  app.get("/", async (c) => {
    type Row = { version: unknown; now: unknown };
    const compiledQuery =
      sql<Row>`SELECT VERSION() AS version, NOW() AS now`.compile(db);
    const output = await db.executeQuery(compiledQuery);
    return c.json(output.rows);
  });

  return app;
};

export const StatusController = {
  path: "/status" as const,
  createApp,
};
