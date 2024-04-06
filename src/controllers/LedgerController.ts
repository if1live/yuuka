import { createControllerApp } from "./helpers.js";

export const app = createControllerApp();

app.get("/", async (c) => {
  const { db } = c.env;
  return c.json({ title: "ledger" });
});

export const path = "/ledger" as const;
