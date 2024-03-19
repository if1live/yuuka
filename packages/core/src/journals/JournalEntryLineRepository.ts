import { JournalEntryLineSchema, type KyselyDB } from "@yuuka/db";

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
