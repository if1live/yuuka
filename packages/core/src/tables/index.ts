import type { Kysely } from "kysely";

import * as AccountSchema from "./AccountSchema.js";
import * as AccountStatementSchema from "./AccountStatementSchema.js";
import * as AccountTagSchema from "./AccountTagSchema.js";
import * as AccountTransactionSchema from "./AccountTransactionSchema.js";
import * as LedgerStatementSchema from "./LedgerStatementSchema.js";
import * as LedgerTransactionSchema from "./LedgerTransactionSchema.js";

export * as AccountTagSchema from "./AccountTagSchema.js";
export * as AccountSchema from "./AccountSchema.js";
export * as AccountTransactionSchema from "./AccountTransactionSchema.js";
export * as LedgerTransactionSchema from "./LedgerTransactionSchema.js";
export * as AccountStatementSchema from "./AccountStatementSchema.js";
export * as LedgerStatementSchema from "./LedgerStatementSchema.js";

/**
 * Database 쓰면 sqlite같은것과 이름 겹쳐서 원하지 않은 형태로 자동완성된다.
 * 이를 피하려고 이름을 다르게 쓴다.
 */
export interface MyDatabase {
  [AccountTagSchema.name]: AccountTagSchema.Table;
  [AccountSchema.name]: AccountSchema.Table;
  [AccountTransactionSchema.name]: AccountTransactionSchema.Table;
  [LedgerTransactionSchema.name]: LedgerTransactionSchema.Table;
  [AccountStatementSchema.name]: AccountStatementSchema.Table;
  [LedgerStatementSchema.name]: LedgerStatementSchema.Table;
}

const createSchema = async <T>(db: Kysely<T>) => {
  await AccountTagSchema.createSchema(db);
  await AccountSchema.createSchema(db);
  await AccountTransactionSchema.createSchema(db);
  await LedgerTransactionSchema.createSchema(db);
  await AccountStatementSchema.createSchema(db);
  await LedgerStatementSchema.createSchema(db);
};

export const MyDatabase = {
  createSchema,
};

/** 많은곳에서 사용되는데 import 줄이고 싶어서 단축 정의 */
export type KyselyDB = Kysely<MyDatabase>;
