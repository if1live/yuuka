import { Hono } from "hono";
import { db } from "../db.js";
import { AccountCodeRepository } from "../masterdata/AccountCodeRepository.js";
import { AccountTagRepository } from "../masterdata/AccountTagRepository.js";
import { MyResponse } from "../networks/index.js";
import type { AsControllerFn } from "../networks/rpc.js";
import { resourceSpecification } from "../specifications/index.js";
import { registerHandler } from "./helpers.js";

const sheet = resourceSpecification.dataSheet;
type Sheet = typeof sheet;

const masterdata: AsControllerFn<Sheet["masterdata"]> = async (req) => {
  const permission = { userId: req.userId };

  const [accountTags, accountCodes] = await Promise.all([
    AccountTagRepository.load(db, permission),
    AccountCodeRepository.load(db, permission),
  ]);

  return new MyResponse({
    accountTags,
    accountCodes,
  });
};

const app = new Hono();
registerHandler(app, sheet.masterdata, masterdata);

export const ResourceController = {
  path: resourceSpecification.resource,
  app,
};
