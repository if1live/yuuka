import { z } from "zod";
import {
  HttpEndpoint,
  HttpInOut,
  HttpRpc,
  InOutSchema,
} from "../networks/rpc.js";
import type { AccountStatementSchema } from "../tables/index.js";
import { Empty } from "./types.js";

export const resource = "/ledger";

const LedgerReq = z.object({
  code: z.coerce.number(),
  startDate: z.string(),
  endDate: z.string(),
});

type LedgerResp = {
  code: number;
  statement: AccountStatementSchema.Row;
  ledgers: Array<{
    id: string;
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
