import { z } from "zod";
import type { AccountCode, AccountTag } from "../index.js";
import {
  HttpEndpoint,
  HttpInOut,
  HttpRpc,
  InOutSchema,
} from "../networks/rpc.js";

export const resource = "/api/resource";

const EmptyReq = z.object({});

type MasterDataResp = {
  accountTags: AccountTag[];
  accountCodes: AccountCode[];
};

const masterdata_endpoint = HttpEndpoint.define({
  method: "get",
  path: "/masterdata",
});

const masterdata_inout = HttpInOut.define({
  _in: {} as z.infer<typeof EmptyReq>,
  _out: {} as MasterDataResp,
});

const masterdata_schema = InOutSchema.define({
  req: EmptyReq,
  resp: EmptyReq,
});

const masterdata = HttpRpc.define({
  endpoint: masterdata_endpoint,
  inout: masterdata_inout,
  schema: masterdata_schema,
});

export const dataSheet = {
  masterdata,
};

export type DataSheet = typeof dataSheet;
