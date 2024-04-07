import { z } from "zod";
import { AccountStatementRepository } from "../accounts/repositories/index.js";
import { dateSchema } from "../core/types.js";
import { LedgerService } from "../ledgers/services/index.js";
import type { MyRequest } from "../networks/types.js";
import type { AccountStatementTable } from "../tables/index.js";

export const ListReq = z.object({
  code: z.coerce.number(),
  startDate: dateSchema,
  endDate: dateSchema,
});
export type ListReq = z.infer<typeof ListReq>;

export const list = async (req: MyRequest<ListReq>) => {
  const body = req.body;
  const code = body.code < 1000 ? body.code * 1000 : body.code;
  const { startDate, endDate } = body;

  const ledgers = await LedgerService.load(req.db, code, {
    start: startDate,
    end: endDate,
  });

  const statement_found = await AccountStatementRepository.loadByCodeAndDate(
    req.db,
    code,
    startDate,
  );
  const statement: AccountStatementTable.Row = statement_found ?? {
    code,
    date: startDate,
    closingBalance: 0,
    totalDebit: 0,
    totalCredit: 0,
  };

  return {
    code,
    statement,
    ledgers,
  };
};
export type ListResp = Awaited<ReturnType<typeof list>>;
