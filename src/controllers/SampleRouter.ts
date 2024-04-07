import { engine } from "../instances.js";
import { createHonoApp } from "./helpers.js";

export const app = createHonoApp();

app.get("/", async (c) => {
  const html = await engine.renderFile("index", { name: "foo" });
  return c.html(html);
});

export const path = "/sample" as const;
