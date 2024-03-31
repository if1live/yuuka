import { Hono } from "hono";
import type { KyselyDB } from "../index.js";
import { engine } from "../instances.js";

export const createApp = (db: KyselyDB) => {
  const app = new Hono();

  app.get("/", async (c) => {
    const html = await engine.renderFile("accounts/account_index", {});
    return c.html(html);
  });

  return app;
};

export const AccountController = {
  path: "/account",
  createApp,
};
