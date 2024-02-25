import { Hono } from "hono";
import { cors } from "hono/cors";
import * as settings from './settings.js';

export const app = new Hono();

app.use("*", cors());

app.get("/", async (c) => {
  return c.json({ ok: true });
});

app.post("/messages/", async (c) => {
  const body = await c.req.json();
  console.log("body", JSON.stringify(body, null, 2));

  // TODO: gsheet로 그대로 보내기. 로컬 테스트까지 생각하면 더 개선된 형태가 필요
  const resp = await fetch(settings.GOOGLE_SHEET_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await resp.json();
  return c.json(json);
});
