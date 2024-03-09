import type { Hono } from "hono";
import type { z } from "zod";
import { MyRequest } from "../networks/index.js";
import type {
  HttpEndpoint,
  HttpMethod,
  MyResponse,
} from "../networks/index.js";

// TODO: 더 멀쩡한 방식?
export const registerHandler = <
  M extends HttpMethod,
  P extends `/${string}`,
  TIn,
  TOut,
  IZ extends z.ZodType,
>(
  app: Hono,
  spec: {
    endpoint: HttpEndpoint<M, P>;
    schema: { req: z.infer<IZ> };
  },
  handler: (req: MyRequest<TIn>) => Promise<MyResponse<TOut>>,
) => {
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
    const res = await handler(req);
    return c.json(res.body as unknown);
  });
};
