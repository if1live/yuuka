import { z } from "zod";
import {
  AccountGroupRepository,
  AccountRepository,
} from "../accounts/repositories/index.js";
import type { MyRequest } from "../networks/types.js";

export const ListReq = z.object({});
export type ListReq = z.infer<typeof ListReq>;

export const list = async (req: MyRequest<ListReq>) => {
  const db = req.db;

  const [accountGroups, accounts] = await Promise.all([
    AccountGroupRepository.loadAll(db),
    AccountRepository.loadAll(db),
  ]);

  return {
    accountGroups,
    accounts,
  };
};
