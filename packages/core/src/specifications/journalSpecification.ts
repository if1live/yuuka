import type { z } from "zod";
import type { JournalEntry } from "../journals/JournalEntry.js";
import {
  HttpEndpoint,
  HttpInOut,
  HttpRpc,
  InOutSchema,
} from "../networks/rpc.js";
import { Empty } from "./types.js";

export const resource = "/api/journal";

type JournalResp = {
  ymd: string;
  entries: JournalEntry[];
};

const list_endpoint = HttpEndpoint.define({
  method: "get",
  path: "/list",
});

const list_inout = HttpInOut.define({
  _in: {} as z.infer<typeof Empty>,
  _out: {} as JournalResp,
});

const list_schema = InOutSchema.define({
  req: Empty,
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
