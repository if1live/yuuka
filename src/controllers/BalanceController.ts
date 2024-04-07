import { z } from "zod";
import { AccountStatementRepository } from "../accounts/repositories/index.js";
import type { DateText, DayText, MonthText, YearText } from "../core/types.js";
import { dateSchema } from "../core/types.js";
import { LedgerService } from "../ledgers/services/index.js";
import type { MyRequest } from "../networks/types.js";

export const GetReq = z.object({
  date: dateSchema,
  code: z.coerce.number(),
});
export type GetReq = z.infer<typeof GetReq>;

export const get = async (req: MyRequest<GetReq>) => {
  const db = req.db;
  const { date, code } = req.body;

  // TODO: 날짜 연산 더 필요한데
  // 1일로 고정하는거
  const ymd = date.split("-") as [YearText, MonthText, DayText];

  const statement = await AccountStatementRepository.loadByCodeAndDate(
    db,
    code,
    `${ymd[0]}-${ymd[1]}-01`,
  );

  // TODO: 날짜 연산 더 필요한데
  const ts_start = new Date(date).getTime();
  const ts_end = ts_start + 24 * 60 * 60 * 1000;
  const endDateObj = ts_end;
  const endDate = new Date(endDateObj).toISOString().split("T")[0] as DateText;

  const ledgers = await LedgerService.load(db, code, {
    start: date,
    end: endDate,
  });

  return {
    statement,
    ledgers,
  };
};
export type GetResp = Awaited<ReturnType<typeof get>>;
