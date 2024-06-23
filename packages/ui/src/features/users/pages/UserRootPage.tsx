import { Button, Container, Group } from "@mantine/core";
import type { ResourceController } from "@yuuka/api";
import { LocalDatabase } from "../../../db.js";
import { myfetch } from "../../../fetchers.js";
import { useMasterData } from "../../../providers/MasterDataProvider.js";
import { SupabaseSignOutButton } from "../components/SupabaseSignOutButton.js";

export const UserRootPage = () => {
  const masterdata = useMasterData();
  const { accounts, presets } = masterdata;

  const synchronize = async () => {
    const endpoint = "/api/resource/masterdata/";
    const data = await myfetch(endpoint);
    const resp = data as ResourceController.MasterdataResp;
    masterdata.synchronize(resp);
  };

  const clear = async () => {
    masterdata.synchronize({
      accounts: [],
      presets: [],
    });
  };

  return (
    <Container>
      <h1>user root</h1>

      <Group>
        <Button onClick={synchronize}>synchronize</Button>
        <Button onClick={clear}>clear</Button>
        <SupabaseSignOutButton />
      </Group>

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
