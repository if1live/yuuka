import { z } from "zod";
import {
  AccountGroupRepository,
  AccountRepository,
  AccountStatementRepository,
} from "../accounts/repositories/index.js";
import { AccountSnapshotService } from "../accounts/services/index.js";
import { DateOnly } from "../core/DateOnly.js";
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
export type ListResp = Awaited<ReturnType<typeof list>>;

export const SnapshotReq = z.object({
  date: DateOnly.schema,
});
export type SnapshotReq = z.infer<typeof SnapshotReq>;
export const snapshot = async (req: MyRequest<SnapshotReq>) => {
  const db = req.db;
  const { date } = req.body;
  const result = await AccountSnapshotService.execute(db, date);

  return result;
};
export type SnapshotResp = Awaited<ReturnType<typeof snapshot>>;
