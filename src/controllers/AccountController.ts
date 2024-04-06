import {
  AccountGroupRepository,
  AccountRepository,
} from "../accounts/repositories/index.js";
import { createControllerApp } from "./helpers.js";

export const app = createControllerApp();

app.get("/", async (c) => {
  const { db } = c.env;

  // const html = await engine.renderFile("accounts/account_index", {});
  // return c.html(html);

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
