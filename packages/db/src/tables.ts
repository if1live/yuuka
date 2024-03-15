import {
  AccountCodeSchema,
  AccountTagSchema,
  JournalEntryLineSchema,
  JournalEntrySchema,
  PreferenceSchema,
  UserSchema,
} from "./entities/index.js";

export interface Database {
  [JournalEntrySchema.name]: JournalEntrySchema.Table;
  [AccountTagSchema.name]: AccountTagSchema.Table;
  [AccountCodeSchema.name]: AccountCodeSchema.Table;
  [JournalEntryLineSchema.name]: JournalEntryLineSchema.Table;
  [PreferenceSchema.name]: PreferenceSchema.Table;
  [UserSchema.name]: UserSchema.Table;
}
