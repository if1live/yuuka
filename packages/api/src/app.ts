import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { HealthCheckApp } from "./controllers/HealthCheckApp.js";
import { LedgerApp } from "./controllers/LedgerApp.js";
import { ResourceApp } from "./controllers/ResourceApp.js";

export const app = new Hono();

app.use("*", cors());
app.use(compress());
app.use(prettyJSON());
app.use(logger());

app.get("/", async (c) => c.json({ ok: true }));
app.route(ResourceApp.prefix, ResourceApp.app);
app.route(HealthCheckApp.prefix, HealthCheckApp.app);
app.route(LedgerApp.prefix, LedgerApp.app);
