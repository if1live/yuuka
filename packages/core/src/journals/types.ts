export interface JournalEntry {
  date: string;
  txid: string;
  brief: string;
  lines: JournalEntryLine[];
}

// TODO: union type?
export interface JournalEntryLine {
  code: number;
  debit: number | null;
  credit: number | null;
}
