import { assert } from "@toss/assert";
import { z } from "zod";
import { AccountStatementRepository } from "../accounts/repositories/index.js";
import { DateOnly } from "../core/types.js";
import { LedgerService } from "../ledgers/services/index.js";
import type { MyRequest } from "../networks/types.js";
import type { AccountStatementTable } from "../tables/index.js";

export const ListReq = z.object({
  code: z.coerce.number(),
  startDate: DateOnly.schema,
  endDate: DateOnly.schema,
});
export type ListReq = z.infer<typeof ListReq>;

type Line = {
  id: string;
  brief: string;
  date: string;
  debit: number;
  credit: number;
  balance: number;
};

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

  const lines: Line[] = [
    {
      id: "",
      brief: `${statement.date} 시작`,
      date: statement.date,
      debit: statement.totalDebit,
      credit: statement.totalCredit,
      balance: statement.closingBalance,
    },
  ];

  // TODO: 항목에 따라서 balance 계산 방식을 바꿔야하나?
  // 계정코드로 수익과 비용은 동작이 반대니까
  // 부호를 무시한다면 문제가 없을거같기도 하고?
  for (const ledger of ledgers) {
    const last = lines[lines.length - 1];
    assert(last);

    const next = {
      id: ledger.id,
      brief: ledger.brief,
      date: ledger.date,
      debit: ledger.debit,
      credit: ledger.credit,
      balance: last.balance + ledger.debit - ledger.credit,
    };
    lines.push(next);
  }

  return {
    code,
    lines,
    statement,
    ledgers,
  };
};
export type ListResp = Awaited<ReturnType<typeof list>>;
