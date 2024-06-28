import type { Account, Preset } from "@yuuka/api";
import Dexie, { type EntityTable } from "dexie";

type AccountModel = Account & { id: number };
type PresetModel = Preset & { id: number };

const db = new Dexie("Database") as Dexie & {
  accounts: EntityTable<AccountModel, "id">;
  presets: EntityTable<PresetModel, "id">;
};

db.version(1).stores({
  accounts: "++id, name, description",
  presets: "++id, name, brief",
});

const synchronize = async (props: {
  accounts: Account[];
  presets: Preset[];
}) => {
  await db.accounts.clear();
  await db.presets.clear();

  await db.accounts.bulkAdd(props.accounts);
  await db.presets.bulkAdd(props.presets);
};

const load = async () => {
  const accounts_naive = await db.accounts.toArray();
  const accounts = accounts_naive.sort((a, b) => a.sortKey - b.sortKey);

  const presets = await db.presets.toArray();

  return {
    accounts,
    presets,
  };
};

export const LocalDatabase = {
  synchronize,
  load,
};
