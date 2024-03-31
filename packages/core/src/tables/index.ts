import type { Kysely } from "kysely";

import * as AccountCodeSchema from "./AccountCodeSchema.js";
import * as AccountStatementSchema from "./AccountStatementSchema.js";
import * as AccountTagSchema from "./AccountTagSchema.js";
import * as JournalEntryLineSchema from "./JournalEntryLineSchema.js";
import * as JournalEntrySchema from "./JournalEntrySchema.js";
import * as LedgerStatementSchema from "./LedgerStatementSchema.js";

export * as JournalEntrySchema from "./JournalEntrySchema.js";
export * as JournalEntryLineSchema from "./JournalEntryLineSchema.js";
export * as AccountCodeSchema from "./AccountCodeSchema.js";
export * as AccountTagSchema from "./AccountTagSchema.js";
export * as AccountStatementSchema from "./AccountStatementSchema.js";
export * as LedgerStatementSchema from "./LedgerStatementSchema.js";

/**
 * Database 쓰면 sqlite같은것과 이름 겹쳐서 원하지 않은 형태로 자동완성된다.
 * 이를 피하려고 이름을 다르게 쓴다.
 */
export interface MyDatabase {
  [JournalEntrySchema.name]: JournalEntrySchema.Table;
  [AccountTagSchema.name]: AccountTagSchema.Table;
  [AccountCodeSchema.name]: AccountCodeSchema.Table;
  [JournalEntryLineSchema.name]: JournalEntryLineSchema.Table;
  [AccountStatementSchema.name]: AccountStatementSchema.Table;
  [LedgerStatementSchema.name]: LedgerStatementSchema.Table;
}

const createSchema = async <T>(db: Kysely<T>) => {
  await AccountTagSchema.createSchema(db);
  await AccountCodeSchema.createSchema(db);
  await JournalEntrySchema.createSchema(db);
  await JournalEntryLineSchema.createSchema(db);
  await AccountStatementSchema.createSchema(db);
  await LedgerStatementSchema.createSchema(db);
};

export const MyDatabase = {
  createSchema,
};

/** 많은곳에서 사용되는데 import 줄이고 싶어서 단축 정의 */
export type KyselyDB = Kysely<MyDatabase>;
