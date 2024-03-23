import {
  JournalController,
  LedgerController,
  ResourceController,
} from "@yuuka/core";
import type { KyselyDB } from "@yuuka/db";
import { Hono } from "hono";
import type { DataSourceValue } from "../contexts/DataSourceContext";

export interface DataSourceNodeProps {
  setDataSource: (source: DataSourceValue) => void;
  setError: (e: Error) => void;
}

export const createApp = (db: KyselyDB) => {
  const app = new Hono();
  app.route(ResourceController.path, ResourceController.createApp(db));
  app.route(JournalController.path, JournalController.createApp(db));
  app.route(LedgerController.path, LedgerController.createApp(db));
  return app;
};
