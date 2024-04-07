import type { Session } from "@supabase/supabase-js";
import { Hono } from "hono";
import { AccountApi, JournalApi, LedgerApi } from "../../index.js";
import type { MyKysely } from "../../index.js";
import type { DataSourceValue } from "./DataSourceContext.js";

export interface DataSourceNodeProps {
  setDataSource: (source: DataSourceValue) => void;
  setError: (e: Error) => void;
  session: Session;
}

export const createApp = (db: MyKysely) => {
  const app = new Hono();

  app.use("*", async (c, next) => {
    c.env = { db };
    await next();
  });

  app.route(AccountApi.path, AccountApi.app);
  app.route(JournalApi.path, JournalApi.app);
  app.route(LedgerApi.path, LedgerApi.app);
  return app;
};
