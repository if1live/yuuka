import {
  type AccountTransactionTable,
  LedgerTransactionTable,
} from "../../tables/index.js";
import type { Journal } from "../models/Journal.js";

/**
 * journal entry 여러개를 한번에 넣게 하려면 변환과 insert를 나눌수 있어야한다.
 */
export const prepare = (
  input: Journal,
): {
  accounts: AccountTransactionTable.NewRow[];
  ledgers: LedgerTransactionTable.NewRow[];
} => {
  const account: AccountTransactionTable.NewRow = {
    txid: input.id,
    date: input.date,
    brief: input.brief,
  };

  const ledgers = input.lines.map((line): LedgerTransactionTable.NewRow => {
    switch (line._tag) {
      case "credit":
        return {
          txid: input.id,
          code: line.code,
          tag: LedgerTransactionTable.creditTag,
          amount: line.credit,
        };
      case "debit":
        return {
          txid: input.id,
          code: line.code,
          tag: LedgerTransactionTable.debitTag,
          amount: line.debit,
        };
    }
  });

  return {
    accounts: [account],
    ledgers,
  };
};
