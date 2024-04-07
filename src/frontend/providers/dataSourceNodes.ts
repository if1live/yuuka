import type { Session } from "@supabase/supabase-js";
import { Hono } from "hono";
import { AccountApp, JournalApp, LedgerApp } from "../../index.js";
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

  app.route(AccountApp.path, AccountApp.app);
  app.route(JournalApp.path, JournalApp.app);
  app.route(LedgerApp.path, LedgerApp.app);
  return app;
};
