import { z } from "zod";
import type { JournalEntry } from "../journals/JournalEntry.js";
import {
  HttpEndpoint,
  HttpInOut,
  HttpRpc,
  InOutSchema,
} from "../networks/rpc.js";
import { Empty } from "./types.js";

export const resource = "/api/journal";

const ListReq = z.object({
  /** start 포함 */
  startDate: z.string(),
  /** end 미포함 */
  endDate: z.string(),
});

type ListResp = {
  entries: JournalEntry[];
};

const list_endpoint = HttpEndpoint.define({
  method: "get",
  path: "/list",
});

const list_inout = HttpInOut.define({
  _in: {} as z.infer<typeof ListReq>,
  _out: {} as ListResp,
});

const list_schema = InOutSchema.define({
  req: ListReq,
  resp: Empty,
});

const list = HttpRpc.define({
  endpoint: list_endpoint,
  inout: list_inout,
  schema: list_schema,
});

const GetReq = z.object({
  id: z.string(),
});

type GetResp = JournalEntry;

const get_endpoint = HttpEndpoint.define({
  method: "get",
  path: "/entry",
});

const get_inout = HttpInOut.define({
  _in: {} as z.infer<typeof GetReq>,
  _out: {} as GetResp,
});

const get_schema = InOutSchema.define({
  req: GetReq,
  resp: Empty,
});

const get = HttpRpc.define({
  endpoint: get_endpoint,
  inout: get_inout,
  schema: get_schema,
});

export const dataSheet = {
  list,
  get,
};

export type DataSheet = typeof dataSheet;
