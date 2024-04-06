import { createControllerApp } from "./helpers.js";

export const app = createControllerApp();

app.get("/", async (c) => {
  const { db } = c.env;
  return c.json({ title: "journal" });
});

export const path = "/journal" as const;
