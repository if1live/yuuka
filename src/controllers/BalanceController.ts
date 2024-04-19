import { z } from "zod";
import {
  BalanceService,
  TrialBalanceService,
} from "../accounts/services/index.js";
import { DateOnly } from "../core/types.js";
import type { MyRequest } from "../networks/types.js";

export const GetReq = z.object({
  date: DateOnly.schema,
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

export const TrialBalanceReq = z.object({
  date: DateOnly.schema,
});
export type TrialBalanceReq = z.infer<typeof TrialBalanceReq>;
export const trialBalance = async (req: MyRequest<TrialBalanceReq>) => {
  const db = req.db;
  const { date } = req.body;

  const date_first = DateOnly.setDay(date, 1);
  const date_end = DateOnly.setDayAsLastDayOfMonth(date_first);
  const results = await TrialBalanceService.report(db, date_first, date_end);
  return {
    date_first,
    date_end,
    accounts: results,
  };
};
export type TrialBalanceResp = Awaited<ReturnType<typeof trialBalance>>;
