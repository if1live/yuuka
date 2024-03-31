import { Hono } from "hono";
import { AccountRepository } from "../masterdata/repositories/AccountRepository.js";
import { AccountTagRepository } from "../masterdata/repositories/AccountTagRepository.js";
import { MyResponse } from "../networks/index.js";
import type { AsControllerFn } from "../networks/rpc.js";
import { resourceSpecification } from "../specifications/index.js";
import type { KyselyDB } from "../tables/index.js";
import { registerHandler } from "./helpers.js";

const sheet = resourceSpecification.dataSheet;
type Sheet = typeof sheet;

const masterdata: AsControllerFn<Sheet["masterdata"]> = async (req) => {
  const db = req.db;

  const [accountTags, accountCodes] = await Promise.all([
    AccountTagRepository.load(db),
    AccountRepository.load(db),
  ]);

  return new MyResponse({
    accountTags,
    accountCodes,
  });
};

const createApp = (db: KyselyDB) => {
  const app = new Hono();
  registerHandler(app, db, sheet.masterdata, masterdata);
  return app;
};

export const ResourceController = {
  path: resourceSpecification.resource,
  createApp,
};
