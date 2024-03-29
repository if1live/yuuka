import type { KyselyDB } from "@yuuka/db";
import type { Hono } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import { ResultAsync } from "neverthrow";
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
  db: KyselyDB,
  spec: {
    endpoint: HttpEndpoint<M, P>;
    schema: { req: z.infer<IZ> };
  },
  handler: (req: MyRequest<TIn>) => Promise<MyResponse<TOut>>,
) => {
  app[spec.endpoint.method](spec.endpoint.path, async (c) => {
    // TODO: form-data
    // console.log('formData', await c.req.formData())

    const jsonResult = await ResultAsync.fromPromise(
      c.req.json(),
      (e) => e as Error,
    );

    const data_raw = {
      ...c.req.query(),
      ...jsonResult.unwrapOr({}),
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

    try {
      const data = data_result.data;
      const req = new MyRequest({
        body: data,
        db,
      });

      const res = await handler(req);
      return c.json(res.body as unknown);
    } catch (e) {
      const err = e as ErrorLike;
      const status = err.status ?? 500;

      if (e instanceof Error) {
        // 좀 멍청하지만 개발하는동안에는 보이는게 나을듯
        const lines = (e.stack ?? "").split("\n").map((x) => x.trim());
        const output = {
          name: e.name,
          message: e.message,
          stack: lines,
        };
        return c.json(output, status);
      }

      // else...
      const output = {
        message: "Unknown error",
      };
      return c.json(output, status);
    }
  });
};

interface ErrorLike {
  status?: StatusCode;
}
