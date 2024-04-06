import {
  AccountGroupRepository,
  AccountRepository,
} from "../accounts/repositories/index.js";
import { engine } from "../instances.js";
import { createControllerApp } from "./helpers.js";

export const app = createControllerApp();

app.get("/", async (c) => {
  const html = await engine.renderFile("accounts/account_index", {});
  return c.html(html);
});

app.get("/list", async (c) => {
  const { db } = c.env;

  const [accountGroups, accounts] = await Promise.all([
    AccountGroupRepository.loadAll(db),
    AccountRepository.loadAll(db),
  ]);

  return c.json({
    accountGroups,
    accounts,
  });
});

export const path = "/account" as const;
