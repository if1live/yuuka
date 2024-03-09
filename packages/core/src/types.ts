export type AccountCategory =
  | "asset"
  | "liability"
  | "equity"
  | "revenue"
  | "expense";

export interface AccountTag {
  major: AccountCategory;
  minor: string;
  code: number;
  name: string;
  description: string;
}

export interface AccountCode {
  tag: AccountTag;
  code: number;
  name: string;
  description: string;
}

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
