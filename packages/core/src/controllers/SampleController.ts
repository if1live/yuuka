import type { KyselyDB } from "@yuuka/db";
import { Hono } from "hono";
import { engine } from "../instances/index.js";
import { MyResponse } from "../networks/index.js";
import type { AsControllerFn } from "../networks/rpc.js";
import { sampleSpecification } from "../specifications/index.js";
import { registerHandler } from "./helpers.js";

const sheet = sampleSpecification.dataSheet;
type Sheet = typeof sheet;

const add: AsControllerFn<Sheet["add"]> = async (req) => {
  const { a, b } = req.body;
  return new MyResponse({ sum: a + b });
};

const createApp = (db: KyselyDB) => {
  const app = new Hono();
  registerHandler(app, db, sheet.add, add);

  app.get("/", async (c) => {
    const html = await engine.renderFile("index", { name: "foo" });
    return c.html(html);
  });

  return app;
};

export const SampleController = {
  path: sampleSpecification.resource,
  createApp,
};
