import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Hono } from "hono";
import type { LambdaEvent } from "hono/aws-lambda";
import { handle } from "hono/aws-lambda";
import { sql } from "kysely";
import { db } from "../db.js";
// import { app } from "../app.js";

const app = new Hono();

// 기본 작동 테스트는 다른곳으로 옮길 예정
app.get("/", async (c) => {
  return c.json({ name: "yuuka" });
});

app.get("/status", async (c) => {
  return c.json({ ok: true });
});

// TODO: db 연결 테스트. 다른곳으로 옮겨질 예정
app.get("/db", async (c) => {
  type Row = { version: unknown; now: unknown };
  const compiledQuery =
    sql<Row>`SELECT VERSION() AS version, NOW() AS now`.compile(db);
  const output = await db.executeQuery(compiledQuery);
  return c.json(output.rows);
});

export const dispatch: APIGatewayProxyHandlerV2 = async (event, context) => {
  const handler = handle(app);
  const result = handler(event as unknown as LambdaEvent, context);
  return result;
};
