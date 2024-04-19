import { z } from "zod";
import {
  BalanceService,
  TrialBalanceService,
} from "../accounts/services/index.js";
import {
  type DateText,
  type DayText,
  type MonthText,
  type YearText,
  dateSchema,
} from "../core/types.js";
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

export const TrialBalanceReq = z.object({
  date: dateSchema,
});
export type TrialBalanceReq = z.infer<typeof TrialBalanceReq>;
export const trialBalance = async (req: MyRequest<TrialBalanceReq>) => {
  const db = req.db;
  const { date } = req.body;

  // TODO: 날짜 연산 더 필요한데
  // 1일로 고정하는거
  const ymd = date.split("-") as [YearText, MonthText, DayText];
  const date_first = `${ymd[0]}-${ymd[1]}-01` as DateText;
  // TODO: 날짜 연산 더 필요한데. 다음날 지정
  const ts_base = new Date(date).getTime();
  const ts_nextDay = ts_base + 24 * 60 * 60 * 1000;
  const nextDayDate = ts_nextDay;
  const date_nextDay = new Date(nextDayDate)
    .toISOString()
    .split("T")[0] as DateText;

  const results = await TrialBalanceService.report(
    db,
    date_first,
    date_nextDay,
  );
  return results;
};
export type TrialBalanceResp = Awaited<ReturnType<typeof trialBalance>>;
