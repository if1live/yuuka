import { Hono } from "hono";
import { AccountRouter, JournalRouter, LedgerRouter } from "../../index.js";
import type { MyKysely } from "../../index.js";
import type { DataSourceValue } from "./DataSourceContext.js";

export interface DataSourceNodeProps {
  setDataSource: (source: DataSourceValue) => void;
  setError: (e: Error) => void;
}

export const createApp = (db: MyKysely) => {
  const app = new Hono();

  app.use("*", async (c, next) => {
    c.env = { db };
    await next();
  });

  app.route(AccountRouter.path, AccountRouter.app);
  app.route(JournalRouter.path, JournalRouter.app);
  app.route(LedgerRouter.path, LedgerRouter.app);
  return app;
};
