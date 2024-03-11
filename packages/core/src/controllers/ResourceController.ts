import { Hono } from "hono";
import { MasterData } from "../masterdata/instances.js";
import { MyResponse } from "../networks/index.js";
import type { AsControllerFn } from "../networks/rpc.js";
import { resourceSpecification } from "../specifications/index.js";
import { registerHandler } from "./helpers.js";

const sheet = resourceSpecification.dataSheet;
type Sheet = typeof sheet;

const masterdata: AsControllerFn<Sheet["masterdata"]> = async (req) => {
  return new MyResponse({
    accountTags: MasterData.accountTags,
    accountCodes: MasterData.accountCodes,
  });
};

const app = new Hono();
registerHandler(app, sheet.masterdata, masterdata);

export const ResourceController = {
  path: resourceSpecification.resource,
  app,
};
