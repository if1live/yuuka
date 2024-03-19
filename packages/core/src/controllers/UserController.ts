import type { KyselyDB } from "@yuuka/db";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { MyResponse } from "../index.js";
import type { AsControllerFn } from "../networks/rpc.js";
import { userSpecification } from "../specifications/index.js";
import { UserRepository } from "../users/UserRepository.js";
import { AuthToken } from "../users/tokens.js";
import { registerHandler } from "./helpers.js";

const sheet = userSpecification.dataSheet;
type Sheet = typeof sheet;

const authenticate: AsControllerFn<Sheet["authenticate"]> = async (req) => {
  const { username } = req.body;
  const found = await UserRepository.findByUsername(req.db, username);
  if (!found) {
    throw new HTTPException(404, {
      message: "User not found",
    });
  }

  const authToken = AuthToken.sign({
    user_id: found.id,
  });

  return new MyResponse({
    userId: found.id,
    authToken,
  });
};

const createApp = (db: KyselyDB) => {
  const app = new Hono();
  registerHandler(app, db, sheet.authenticate, authenticate);
  return app;
};

export const UserController = {
  path: userSpecification.resource,
  createApp,
};
