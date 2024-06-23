import { Hono } from "hono";
import { AccessTokenHelper } from "../helpers/tokens.js";
import { db } from "../instances/database.js";
import { ResourceController } from "./ResourceController.js";

export const app = new Hono();

app.get("/masterdata/", async (c) => {
  const parsedUserId = AccessTokenHelper.extract(c);
  const userId = parsedUserId ?? "";

  const result = await ResourceController.masterdata(db, userId);
  return c.json(result);
});

export const path = "/api/resource" as const;
