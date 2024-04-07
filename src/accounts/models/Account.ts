import type { AccountTable } from "../../tables/index.js";
import type { AccountGroup } from "./AccountGroup.js";

export interface Account {
  code: number;
  name: string;
  description: string;
}

const toGroup = (code: number) => {
  return Math.floor(code / 1000);
};

const fromRow = (row: AccountTable.Row): Account => {
  return {
    code: row.code,
    name: row.name,
    description: row.description,
  };
};

const zip = (accounts: Account[], groups: AccountGroup[]) => {
  const groupMap = new Map(groups.map((x) => [x.code, x]));

  return accounts.map((account) => {
    const groupCode = Account.toGroup(account.code);

    // group 못찾았을때 터트리는것보다는 빈값으로 땜질
    let group = groupMap.get(groupCode);
    if (!group) {
      group = {
        code: groupCode,
        description: "unknown",
        major: "asset",
        minor: "unknown",
        name: "unknown",
      };
    }

    return { account, group };
  });
};

export const Account = {
  toGroup,
  fromRow,
  zip,
};
