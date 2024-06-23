import type { MyKysely } from "../rdbms/types.js";
import { AccountRepository, PresetRepository } from "../repositories/index.js";

const masterdata = async (db: MyKysely, userId: string) => {
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

export const ResourceController = {
  masterdata,
};
