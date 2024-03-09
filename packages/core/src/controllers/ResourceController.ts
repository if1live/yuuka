import { Hono } from "hono";
import { MyResponse } from "../networks/index.js";
import type { AsControllerFn } from "../networks/rpc.js";
import { resourceSpecification } from "../specifications/index.js";
import { registerHandler } from "./helpers.js";

const sheet = resourceSpecification.dataSheet;
type Sheet = typeof sheet;

const masterdata: AsControllerFn<Sheet["masterdata"]> = async (req) => {
  // TODO:
  return new MyResponse({
    accountCodes: [],
    accountTags: [],
  });
};

const app = new Hono();
registerHandler(app, sheet.masterdata, masterdata);

export const ResourceController = {
  app,
};
