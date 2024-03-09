import { z } from "zod";
import {
  HttpEndpoint,
  HttpInOut,
  HttpRpc,
  InOutSchema,
} from "../networks/rpc.js";
import { Empty } from "./types.js";

export const resource = "/api/ledger";

const LedgerReq = z.object({
  ymd: z.string(),
  code: z.coerce.number(),
});

type LedgerResp = {
  code: number;
  ledgers: Array<{
    txid: string;
    date: string;
    brief: string;

    debit: number;
    credit: number;
  }>;
};

const list_endpoint = HttpEndpoint.define({
  method: "get",
  path: "/list",
});

const list_inout = HttpInOut.define({
  _in: {} as z.infer<typeof LedgerReq>,
  _out: {} as LedgerResp,
});

const list_schema = InOutSchema.define({
  req: LedgerReq,
  resp: Empty,
});

const list = HttpRpc.define({
  endpoint: list_endpoint,
  inout: list_inout,
  schema: list_schema,
});

export const dataSheet = {
  list,
};

export type DataSheet = typeof dataSheet;
