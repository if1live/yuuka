import { z } from "zod";
import {
  HttpEndpoint,
  HttpInOut,
  HttpRpc,
  InOutSchema,
} from "../networks/rpc.js";

export const resource = "/user";

const AuthenticateReq = z.object({
  username: z.string().min(1),
});

const AuthenticateResp = z.object({
  userId: z.number(),
  authToken: z.string(),
});

const authenticate_endpoint = HttpEndpoint.define({
  method: "post",
  path: "/authenticate",
});

const authenticate_inout = HttpInOut.define({
  _in: {} as z.infer<typeof AuthenticateReq>,
  _out: {} as z.infer<typeof AuthenticateResp>,
});

const authenticate_schema = InOutSchema.define({
  req: AuthenticateReq,
  resp: AuthenticateResp,
});

const authenticate = HttpRpc.define({
  endpoint: authenticate_endpoint,
  inout: authenticate_inout,
  schema: authenticate_schema,
});

export const dataSheet = {
  authenticate,
};

export type DataSheet = typeof dataSheet;
