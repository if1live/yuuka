import { serveStatic } from "@hono/node-server/serve-static";
import { default as SQLite } from "better-sqlite3";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { CamelCasePlugin, Kysely, SqliteDialect } from "kysely";
import { AccountController } from "./controllers/index.js";
import { KyselyHelper } from "./rdbms/index.js";
import type { MyDatabase } from "./rdbms/types.js";

export const app = new Hono();

// TODO: db
const database = new SQLite(":memory:");
const dialect = new SqliteDialect({
  database: database,
});
const db = new Kysely<MyDatabase>({
  dialect,
  plugins: [new CamelCasePlugin()],
  // log: ['query', 'error']
});
await KyselyHelper.createSchema(db);

app.use("*", logger());
app.use("*", cors());
app.use("*", compress());

app.use("*", async (c, next) => {
  c.env = { db };
  await next();
});

const robotsTxt = `
User-agent: *
Allow: /

User-agent: GPTBot
Disallow: /
`.trimStart();

app.get("/robots.txt", async (c) => {
  return c.text(robotsTxt);
});

app.use("/static/*", serveStatic({ root: "./" }));

app.get("/", async (c) => {
  return c.json({ name: "yuuka" });
});

app.route(AccountController.path, AccountController.app);
