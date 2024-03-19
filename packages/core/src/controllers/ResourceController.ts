import type { Database } from "@yuuka/db";
import { Hono } from "hono";
import type { Kysely } from "kysely";
import { AccountCodeRepository } from "../masterdata/AccountCodeRepository.js";
import { AccountTagRepository } from "../masterdata/AccountTagRepository.js";
import { MyResponse } from "../networks/index.js";
import type { AsControllerFn } from "../networks/rpc.js";
import { resourceSpecification } from "../specifications/index.js";
import { registerHandler } from "./helpers.js";

const sheet = resourceSpecification.dataSheet;
type Sheet = typeof sheet;

const masterdata: AsControllerFn<Sheet["masterdata"]> = async (req) => {
  const db = req.db;

  const [accountTags, accountCodes] = await Promise.all([
    AccountTagRepository.load(db),
    AccountCodeRepository.load(db),
  ]);

  return new MyResponse({
    accountTags,
    accountCodes,
  });
};

const createApp = (db: Kysely<Database>) => {
  const app = new Hono();
  registerHandler(app, db, sheet.masterdata, masterdata);
  return app;
};

export const ResourceController = {
  path: resourceSpecification.resource,
  createApp,
};
