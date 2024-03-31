import { Hono } from "hono";
import type { KyselyDB } from "../index.js";
import { engine } from "../instances.js";

export const createApp = (db: KyselyDB) => {
  const app = new Hono();

  app.get("/", async (c) => {
    const html = await engine.renderFile("index", { name: "foo" });
    return c.html(html);
  });

  return app;
};

export const SampleController = {
  path: "/sample",
  createApp,
};
