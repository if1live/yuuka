import type { z } from "zod";
import type { AccountCode, AccountTag } from "../index.js";
import {
  HttpEndpoint,
  HttpInOut,
  HttpRpc,
  InOutSchema,
} from "../networks/rpc.js";
import { Empty } from "./types.js";

export const resource = "/api/resource";

type MasterDataResp = {
  accountTags: AccountTag[];
  accountCodes: AccountCode[];
};

const masterdata_endpoint = HttpEndpoint.define({
  method: "get",
  path: "/masterdata",
});

const masterdata_inout = HttpInOut.define({
  _in: {} as z.infer<typeof Empty>,
  _out: {} as MasterDataResp,
});

const masterdata_schema = InOutSchema.define({
  req: Empty,
  resp: Empty,
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
