import type { AccountTable } from "../../tables/index.js";

export interface AccountCode {
  code: number;
  name: string;
  description: string;
}

const toGroup = (code: number) => {
  return Math.floor(code / 1000);
};

const fromRow = (row: AccountTable.Row): AccountCode => {
  return {
    code: row.code,
    name: row.name,
    description: row.description,
  };
};

export const AccountCode = {
  toGroup,
  fromRow,
};
