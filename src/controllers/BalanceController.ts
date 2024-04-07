import { z } from "zod";
import { BalanceService } from "../accounts/services/index.js";
import { dateSchema } from "../core/types.js";
import type { MyRequest } from "../networks/types.js";

export const GetReq = z.object({
  date: dateSchema,
  code: z.coerce.number(),
});
export type GetReq = z.infer<typeof GetReq>;

export const get = async (req: MyRequest<GetReq>) => {
  const db = req.db;
  const { date, code } = req.body;
  const result = await BalanceService.load(db, code, date);
  return result;
};
export type GetResp = Awaited<ReturnType<typeof get>>;
