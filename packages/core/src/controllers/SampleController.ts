import { Hono } from "hono";
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

const app = new Hono();
registerHandler(app, sheet.add, add);

export const SampleController = {
  app,
};
