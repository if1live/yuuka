import { Hono } from "hono";
import { cors } from "hono/cors";
import { MyRequest, MyResponse } from "./networks/index.js";
import type { AsControllerFn } from "./networks/rpc.js";
import { sampleSpecification } from "./specifications/index.js";

export const app = new Hono();

app.use("*", cors());

app.get("/", (c) => c.text("Hono meets Node.js"));

const spec = sampleSpecification.dataSheet.add;

type AddFn = AsControllerFn<typeof spec>;

const add: AddFn = async (req) => {
  const { a, b } = req.body;
  return new MyResponse({ sum: a + b });
};

app[spec.endpoint.method](spec.endpoint.path, async (c) => {
  const data_raw = {
    ...c.req.query(),
  };
  const data_result = spec.schema.req.safeParse(data_raw);
  if (!data_result.success) {
    const { error } = data_result;
    const message = error.issues[0]?.message;
    const data = {
      message,
      issues: error.issues,
    };
    return c.json(data, 400);
  }

  const data = data_result.data;
  const req = new MyRequest(data);
  const res = await add(req);
  return c.json(res.body);
});
