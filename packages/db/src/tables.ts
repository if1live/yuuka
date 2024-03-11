import {
  AccountCodeSchema,
  JournalEntryLineSchema,
  JournalEntrySchema,
} from "./entities/index.js";

export interface Database {
  [JournalEntrySchema.name]: JournalEntrySchema.Table;
  [AccountCodeSchema.name]: AccountCodeSchema.Table;
  [JournalEntryLineSchema.name]: JournalEntryLineSchema.Table;
}
