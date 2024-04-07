import * as R from "remeda";
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

export const update = async (db: MyKysely, data: Journal) => {
  const found = await read(db, data.id);
  if (!found) {
    throw new Error("not found");
  }

  // 상세 항목 비교해서 필요한 부분만 수정하는게 필요할 정도로 성능이 중요하지 않다.
  // 완전히 똑같을때만 db 를 건드리지 않게 막아둔다.
  if (R.isDeepEqual(found, data)) {
    return 0;
  }

  // account는 1개인게 보장되니까 내용만 고쳐도 된다.
  // primary key 빼고 전부 덮어쓰기
  const accountUpdate: Omit<
    AccountTransactionTable.NewRow,
    keyof AccountTransactionTable.PrimaryKey
  > = {
    brief: data.brief,
    date: data.date,
  };
  await db
    .updateTable(AccountTransactionTable.name)
    .set(accountUpdate)
    .where("txid", "=", data.id)
    .executeTakeFirstOrThrow();

  // ledger는 갯수까지 바뀔수 있다. 머리 쓰기 귀찮아서 지우고 새로 넣는다.
  await db
    .deleteFrom(LedgerTransactionTable.name)
    .where("txid", "=", data.id)
    .executeTakeFirstOrThrow();

  const { ledgers } = prepare(data);
  await LedgerTransactionRepository.insertBulk(db, ledgers);
  return 2;
};

export const remove = async (db: MyKysely, txid: string) => {
  const result_account = await db
    .deleteFrom(AccountTransactionTable.name)
    .where("txid", "=", txid)
    .executeTakeFirstOrThrow();

  const result_ledger = await db
    .deleteFrom(LedgerTransactionTable.name)
    .where("txid", "=", txid)
    .executeTakeFirstOrThrow();

  return {
    account: result_account,
    ledger: result_ledger,
  };
};
