import type { ResourceController } from "@yuuka/api";
import type { PropsWithChildren } from "react";
import useSWR from "swr";
import { myfetch } from "../fetchers.js";
import { MasterDataContext, type MasterDataRoot } from "./MasterDataContext.js";

export const MasterDataProvider = (props: PropsWithChildren) => {
  const endpoint = "/api/resource/masterdata/";
  const { data, error, isLoading } = useSWR(endpoint, myfetch);
  const resp = data as ResourceController.MasterdataResp;

  if (error) {
    return <div>failed to load masterdata</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  const store: MasterDataRoot = {
    accounts: resp.accounts,
    presets: resp.presets,
  };

  return (
    <MasterDataContext.Provider value={store}>
      {props.children}
    </MasterDataContext.Provider>
  );
};
