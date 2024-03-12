import {
  AccountCodeSchema,
  JournalEntryLineSchema,
  JournalEntrySchema,
  PreferenceSchema,
} from "./entities/index.js";

export interface Database {
  [JournalEntrySchema.name]: JournalEntrySchema.Table;
  [AccountCodeSchema.name]: AccountCodeSchema.Table;
  [JournalEntryLineSchema.name]: JournalEntryLineSchema.Table;
  [PreferenceSchema.name]: PreferenceSchema.Table;
}
