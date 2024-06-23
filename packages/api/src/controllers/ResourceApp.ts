import { Hono } from "hono";
import { AccessTokenHelper } from "../helpers/tokens.js";
import { db } from "../instances/database.js";
import { AccountRepository, PresetRepository } from "../repositories/index.js";

const app = new Hono();

app.get("/masterdata/", async (c) => {
  const parsedUserId = AccessTokenHelper.extract(c);
  const userId = parsedUserId ?? "";

  const [accounts, presets] = await Promise.all([
    AccountRepository.loadAll(db, userId),
    PresetRepository.loadAll(db, userId),
  ]);

  return c.json({
    userId,
    accounts,
    presets,
  });
});

export const ResourceApp = {
  prefix: "/api/resource" as const,
  app,
};
