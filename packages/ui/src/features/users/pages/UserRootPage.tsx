import { Container } from "@mantine/core";
import { useContext } from "react";
import { MasterDataContext } from "../../../providers/MasterDataContext.js";
import { SupabaseSignOutButton } from "../components/SupabaseSignOutButton.js";

export const UserRootPage = () => {
  const masterdata = useContext(MasterDataContext);
  const { accounts, presets } = masterdata;

  return (
    <Container>
      <h1>user root</h1>

      <SupabaseSignOutButton />

      <h2>accounts</h2>
      <ul>
        {accounts.map((account) => (
          <li key={account.name}>{account.name}</li>
        ))}
      </ul>

      <h2>presets</h2>
      <ul>
        {presets.map((preset) => (
          <li key={preset.name}>{preset.name}</li>
        ))}
      </ul>
    </Container>
  );
};
