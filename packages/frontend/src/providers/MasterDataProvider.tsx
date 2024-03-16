import { resourceSpecification } from "@yuuka/core";
import type { PropsWithChildren } from "react";
import useSWR from "swr";
import {
  MasterDataContext,
  type MasterDataRoot,
} from "../contexts/MasterDataContext";

export const MasterDataProvider = (props: PropsWithChildren) => {
  const sheet = resourceSpecification.dataSheet;
  const spec = sheet.masterdata;

  const endpoint = `${resourceSpecification.resource}${spec.endpoint.path}`;
  const { data, error, isLoading } = useSWR(endpoint);
  const resp = data as (typeof spec)["inout"]["_out"];

  if (error) {
    return <div>failed to load masterdata</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  const store: MasterDataRoot = {
    accountTags: resp.accountTags,
    accountCodes: resp.accountCodes,
  };

  return (
    <MasterDataContext.Provider value={store}>
      {props.children}
    </MasterDataContext.Provider>
  );
};
