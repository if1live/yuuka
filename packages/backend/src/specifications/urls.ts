import { z } from "zod";
import { HttpEndpoint, HttpInOut, HttpRpc, InOutSchema } from "./rpc.js";

const AddReq = z.object({
  a: z.coerce.number().optional().default(0),
  b: z.coerce.number().optional().default(0),
});

const AddRes = z.object({
  sum: z.coerce.number(),
});

const add_endpoint = HttpEndpoint.define({
  method: "get",
  path: "/api/add",
});

const add_inout = HttpInOut.define({
  _in: {} as z.infer<typeof AddReq>,
  _out: {} as z.infer<typeof AddRes>,
});

const add_schema = InOutSchema.define({
  req: AddReq,
  res: AddRes,
});

const add = HttpRpc.define({
  endpoint: add_endpoint,
  inout: add_inout,
  schema: add_schema,
});

export const dataSheet = {
  add,
};
export type DataSheet = typeof dataSheet;
