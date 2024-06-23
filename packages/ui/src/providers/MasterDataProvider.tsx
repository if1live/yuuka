import type { PropsWithChildren } from "react";
import { masterdata_accounts } from "../hardcoding.js";
import { MasterDataContext, type MasterDataRoot } from "./MasterDataContext.js";

export const MasterDataProvider = (props: PropsWithChildren) => {
  const store: MasterDataRoot = {
    accounts: masterdata_accounts,
  };

  return (
    <MasterDataContext.Provider value={store}>
      {props.children}
    </MasterDataContext.Provider>
  );
};
