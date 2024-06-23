import { Hono } from "hono";
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
  return c.json({ ok: true });
});
