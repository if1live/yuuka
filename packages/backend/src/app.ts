import { Hono } from "hono";
import { cors } from "hono/cors";

export const app = new Hono();

app.use("*", cors());

app.get("/", async (c) => {
  return c.json({ ok: true });
});

app.post("/messages/", async (c) => {
  const body = await c.req.json();
  console.log("body", JSON.stringify(body, null, 2));
  return c.json({ok: true});
});
