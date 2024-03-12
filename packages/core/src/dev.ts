import fs from "node:fs/promises";
import { serve } from "@hono/node-server";
import type { Database } from "@yuuka/db";
import { Kysely } from "kysely";
import { app } from "./app.js";

/*
console.log(`report: ${journalContext.ymd.year}-${journalContext.ymd.month}`);
for (const entry of journalContext.entries) {
  const result = JournalEntry.safeValidate(entry);
  if (result.isOk()) {
    const data = result.value;
    console.log(`ok: ${data.txid}`);
  } else {
    const err = result.error as Error;
    console.error(`fail: ${entry.txid}, ${err.message}`);
  }
}
*/

// TODO: in-memory DB 초기화. sqlite에서만 쓸것
// await prepareSchema(db);
// await insertBulk(db);

// 파일기반 sqlite에도 쓰면 내부를 볼수 있을듯?
/*
const writeDatabaseFile = async () => {
  const fp = "db.sqlite";
  try {
    await fs.unlink(fp);
  } catch (e) {
    // ignore
  }

  const { dialect } = await createSqliteDialect(fp);
  const db = new Kysely<Database>({ dialect });

  await prepareSchema(db);
  await insertBulk(db);

  await db.destroy();
};
await writeDatabaseFile();
*/

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});
