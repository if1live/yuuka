import type { MyKysely } from "../../rdbms/types.js";
import {
  AccountTransactionTable,
  LedgerTransactionTable,
} from "../../tables/index.js";
import type { Journal } from "../models/Journal.js";
import {
  AccountTransactionRepository,
  LedgerTransactionRepository,
} from "../repositories/index.js";

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

  const ledgers_debit = input.lines_debit.map(
    (line): LedgerTransactionTable.NewRow => {
      return {
        txid: input.id,
        code: line.code,
        tag: LedgerTransactionTable.debitTag,
        amount: line.debit,
      };
    },
  );

  const ledgers_credit = input.lines_credit.map(
    (line): LedgerTransactionTable.NewRow => {
      return {
        txid: input.id,
        code: line.code,
        tag: LedgerTransactionTable.creditTag,
        amount: line.credit,
      };
    },
  );

  return {
    accounts: [account],
    ledgers: [...ledgers_debit, ...ledgers_credit],
  };
};

export const read = async (
  db: MyKysely,
  txid: string,
): Promise<Journal | undefined> => {
  const found = await AccountTransactionRepository.findById(db, txid);
  return found;
};

export const insert = async (db: MyKysely, data: Journal) => {
  const { accounts, ledgers } = prepare(data);

  const result_account = await AccountTransactionRepository.insertBulk(
    db,
    accounts,
  );
  const result_ledger = await LedgerTransactionRepository.insertBulk(
    db,
    ledgers,
  );

  return {
    account: result_account,
    ledger: result_ledger,
  };
};

export const update = async (db: MyKysely, data: Journal) => {};

export const remove = async (db: MyKysely, txid: string) => {
  const result_account = await db
    .deleteFrom(AccountTransactionTable.name)
    .where("txid", "=", txid)
    .execute();

  const result_ledger = await db
    .deleteFrom(LedgerTransactionTable.name)
    .where("txid", "=", txid)
    .execute();

  return {
    account: result_account,
    ledger: result_ledger,
  };
};
