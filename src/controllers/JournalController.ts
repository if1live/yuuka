import { z } from "zod";
import { Journal } from "../journals/models/Journal.js";
import { AccountTransactionRepository } from "../journals/repositories/index.js";
import { JournalService } from "../journals/services/index.js";
import type { MyRequest } from "../networks/types.js";

export const ListReq = z.object({
  /** start 포함 */
  startDate: z.string(),

  /** end 미포함 */
  endDate: z.string(),
});
export type ListReq = z.infer<typeof ListReq>;

export const list = async (req: MyRequest<ListReq>) => {
  const { startDate, endDate } = req.body;
  const entries = await AccountTransactionRepository.findByDateRange(req.db, {
    start: startDate,
    end: endDate,
  });
  return entries;
};

export const GetReq = z.object({
  id: z.string(),
});
export type GetReq = z.infer<typeof GetReq>;

export const get = async (req: MyRequest<GetReq>) => {
  const { id } = req.body;
  const found = await AccountTransactionRepository.findById(req.db, id);
  return found;
};

export const CreateReq = Journal.schema;
export type CreateReq = z.infer<typeof CreateReq>;

export const create = async (req: MyRequest<CreateReq>) => {
  const db = req.db;
  const journal = req.body;

  const result = await db.transaction().execute(async (trx) => {
    return await JournalService.insert(trx, journal);
  });

  return journal;
};

export const UpdateReq = Journal.schema;
export type UpdateReq = z.infer<typeof UpdateReq>;

export const update = async (req: MyRequest<UpdateReq>) => {
  const db = req.db;
  const journal = req.body;

  const result = await db.transaction().execute(async (trx) => {
    return await JournalService.update(trx, journal);
  });
  return journal;
};

export const RemoveReq = z.object({
  id: z.string(),
});
export type RemoveReq = z.infer<typeof RemoveReq>;

export const remove = async (req: MyRequest<RemoveReq>) => {
  const db = req.db;
  const { id } = req.body;

  const result = await db.transaction().execute(async (trx) => {
    return await JournalService.remove(trx, id);
  });
  return id;
};
