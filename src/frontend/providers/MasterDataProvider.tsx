import type { PropsWithChildren } from "react";
import useSWR from "swr";
import { AccountApi } from "../../controllers/index.js";
import type { AccountController } from "../../controllers/mod.js";
import { MasterDataContext, type MasterDataRoot } from "./MasterDataContext.js";

export const MasterDataProvider = (props: PropsWithChildren) => {
  const endpoint = `${AccountApi.path}/list`;
  const { data, error, isLoading } = useSWR(endpoint);
  const resp = data as AccountController.ListResp;

  if (error) {
    return <div>failed to load masterdata</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  const store: MasterDataRoot = {
    accountGroups: resp.accountGroups,
    accounts: resp.accounts,
  };

  return (
    <MasterDataContext.Provider value={store}>
      {props.children}
    </MasterDataContext.Provider>
  );
};
