import { JournalEntryLineSchema, type KyselyDB } from "../tables/index.js";

const insertBulk = async (
  db: KyselyDB,
  rows: JournalEntryLineSchema.NewRow[],
) => {
  return await db
    .insertInto(JournalEntryLineSchema.name)
    .values(rows)
    .executeTakeFirstOrThrow();
};

export const JournalEntryLineRepository = {
  insertBulk,
};
