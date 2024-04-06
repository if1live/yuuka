import type { AccountGroupTable } from "../../tables/index.js";
import type { AccountCategory } from "./AccountCategory.js";

export interface AccountGroup {
  major: AccountCategory;
  minor: string;
  code: number;
  name: string;
  description: string;
}

const fromRow = (row: AccountGroupTable.Row): AccountGroup => {
  return {
    major: row.major,
    minor: row.minor,
    code: row.code,
    name: row.name,
    description: row.description,
  };
};

export const AccountGroup = {
  fromRow,
};
