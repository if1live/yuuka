import { createContext } from "react";
import type { Account } from "@yuuka/api";

// 계정과목은 자주 안바뀌니까 전역 상태로 때려박자.
// async/await에 끌려들어갈 범위를 줄이는게 목적
export interface MasterDataRoot {
  accounts: Account[];
}

const defaultValue: MasterDataRoot = {
  accounts: [],
};

export const MasterDataContext = createContext(defaultValue);
