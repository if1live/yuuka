import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { JournalController } from "./controllers/JournalController.js";
import { LedgerController } from "./controllers/LedgerController.js";
import { ResourceController } from "./controllers/ResourceController.js";
import { SampleController } from "./controllers/SampleController.js";
import { StatusController } from "./controllers/StatusController.js";

export const app = new Hono();

app.use("*", logger());
app.use("*", cors());
app.use("*", compress());

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

app.route(StatusController.path, StatusController.app);
app.route(SampleController.path, SampleController.app);
app.route(ResourceController.path, ResourceController.app);
app.route(JournalController.path, JournalController.app);
app.route(LedgerController.path, LedgerController.app);
