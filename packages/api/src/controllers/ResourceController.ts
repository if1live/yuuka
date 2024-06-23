import type { MyKysely } from "../rdbms/types.js";
import { AccountRepository, PresetRepository } from "../repositories/index.js";

export const masterdata = async (db: MyKysely, userId: string) => {
  const [accounts, presets] = await Promise.all([
    AccountRepository.loadAll(db, userId),
    PresetRepository.loadAll(db, userId),
  ]);

  return {
    userId,
    accounts,
    presets,
  };
};

export type MasterdataResp = Awaited<ReturnType<typeof masterdata>>;
