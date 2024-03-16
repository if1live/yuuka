import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { UserRepository } from "../auths/UserRepository.js";
import { AuthToken } from "../auths/tokens.js";
import { db } from "../db.js";
import { MyResponse } from "../index.js";
import type { AsControllerFn } from "../networks/rpc.js";
import { authSpecification } from "../specifications/index.js";
import { registerHandler } from "./helpers.js";

const sheet = authSpecification.dataSheet;
type Sheet = typeof sheet;

const authenticate: AsControllerFn<Sheet["authenticate"]> = async (req) => {
  const { username } = req.body;
  const found = await UserRepository.findByUsername(db, username);
  if (!found) {
    throw new HTTPException(404, {
      message: "User not found",
    });
  }

  const authToken = AuthToken.sign({
    user_id: found.id,
  });

  return new MyResponse({
    authToken,
    userId: found.id,
  });
};

const app = new Hono();
registerHandler(app, sheet.authenticate, authenticate);

export const AuthController = {
  path: authSpecification.resource,
  app,
};
