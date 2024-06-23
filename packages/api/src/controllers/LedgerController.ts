import { nanoid } from "nanoid";
import { z } from "zod";
import type { JournalEntry } from "../ledgers/index.js";
import type { MyKysely } from "../rdbms/types.js";
import { LedgerRepository } from "../repositories/index.js";

const ListReq = z.object({
  userId: z.string(),
});
export type ListReq = z.infer<typeof ListReq>;

export const list = async (db: MyKysely, req: ListReq) => {
  const { userId } = req;
  const entries = await LedgerRepository.find(db, userId);
  return entries;
};
export type ListResp = Awaited<ReturnType<typeof list>>;

export const create = async (
  db: MyKysely,
  userId: string,
  payload: JournalEntry,
) => {
  // API 문제를 될수있는한 피하려고 txid는 임의로 생성
  const transactionId = nanoid();
  const entry: JournalEntry = {
    ...payload,
    id: transactionId,
  };
  const rows = await LedgerRepository.insert(db, userId, entry);
  return entry;
};

const RemoveReq = z.object({
  userId: z.string(),
  txid: z.string(),
});
export type RemoveReq = z.infer<typeof RemoveReq>;

export const remove = async (db: MyKysely, req: RemoveReq) => {
  const { userId, txid } = req;
  const result = await LedgerRepository.remove(db, userId, txid);
  return Number(result.numDeletedRows);
};
