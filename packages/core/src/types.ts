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
