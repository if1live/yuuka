import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { JournalController } from "./controllers/JournalController.js";
import { LedgerController } from "./controllers/LedgerController.js";
import { ResourceController } from "./controllers/ResourceController.js";
import { SampleController } from "./controllers/SampleController.js";
import { db } from "./db.js";

export const app = new Hono();

app.use("*", logger());
app.use("*", cors());
app.use("*", compress());

app.get("/", async (c) => {
  return c.json({ name: "yuuka" });
});

app.route(ResourceController.path, ResourceController.createApp(db));
app.route(JournalController.path, JournalController.createApp(db));
app.route(LedgerController.path, LedgerController.createApp(db));
app.route(SampleController.path, SampleController.createApp(db));
