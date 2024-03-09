export interface JournalEntryTable {
  txid: string;
  date: string;
  brief: string;
}

export interface JournalEntryLineTable {
  txid: string;
  code: number;
  debit: number;
  credit: number;
}

export interface AccountCodeTable {
  code: number;
  tag: number;
  name: string;
  description: string;
}

export interface Database {
  journalEntry: JournalEntryTable;
  journalEntryLine: JournalEntryLineTable;
  accountCode: AccountCodeTable;
}
