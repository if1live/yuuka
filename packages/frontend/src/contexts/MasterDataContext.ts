import type { AccountCode, AccountTag } from "@yuuka/core";
import { createContext } from "react";

export interface MasterDataRoot {
  accountTags: AccountTag[];
  accountCodes: AccountCode[];
}

const defaultValue: MasterDataRoot = {
  accountTags: [],
  accountCodes: [],
};

export const MasterDataContext = createContext(defaultValue);
