export interface JournalEntryTable {
  id: string;
  date: string;
  brief: string;
}

export interface JournalEntryLineTable {
  entry_id: string;
  code: number;
  debit: number;
  credit: number;
}

export interface AccountCodeTable {
  code: number;
  name: string;
  description: string;
}

export interface Database {
  journalEntry: JournalEntryTable;
  journalEntryLine: JournalEntryLineTable;
  accountCode: AccountCodeTable;
}
