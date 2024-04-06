import { engine } from "../instances.js";
import { createControllerApp } from "./helpers.js";

export const app = createControllerApp();

app.get("/", async (c) => {
  const html = await engine.renderFile("index", { name: "foo" });
  return c.html(html);
});

export const path = "/sample" as const;
