import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { HealthCheckApp, LedgerApi, ResourceApi } from "./routes/index.js";

export const app = new Hono();

app.onError((err, c) => {
  console.error(err);

  // 에러를 적당히 json으로 포장하면 편할듯
  const data = {
    name: err.name,
    message: err.message,
    cause: err.cause,
    stack: err.stack?.split("\n").map((x) => x.trim()),
  };
  return c.json(data, 500);
});

app.use("*", cors());
app.use(compress());
app.use(prettyJSON());
app.use(logger());

app.get("/", async (c) => c.json({ ok: true }));
app.route(ResourceApi.path, ResourceApi.app);
app.route(HealthCheckApp.prefix, HealthCheckApp.app);
app.route(LedgerApi.path, LedgerApi.app);
