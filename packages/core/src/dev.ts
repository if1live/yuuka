import { serve } from "@hono/node-server";
import type { Insertable } from "kysely";
import { app } from "./app.js";
import { db } from "./db.js";
import { MasterData } from "./masterdata/instances.js";
import { journalContext } from "./instances.js";
import type {
  AccountCodeTable,
  JournalEntryLineTable,
  JournalEntryTable,
} from "./tables.js";

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

// in-memory DB 초기화
// 데이터를 다양한 방식으로 뒤지려면 db에 채워놓는게 나을듯
const insertBulk_accountCode = async () => {
  await db.schema
    .createTable("accountCode")
    .addColumn("code", "integer", (c) => c.primaryKey())
    .addColumn("tag", "integer")
    .addColumn("name", "varchar(255)")
    .addColumn("description", "varchar(255)")
    .execute();

  await db.schema
    .createIndex("idx_accountCode_tag")
    .on("accountCode")
    .columns(["tag"])
    .execute();

  const items = MasterData.accountCodes.map(
    (x): Insertable<AccountCodeTable> => {
      return {
        code: x.code,
        tag: Math.floor(x.code / 1000),
        name: x.name,
        description: x.description,
      };
    },
  );

  await db.insertInto("accountCode").values(items).execute();
};

const insertBulk_journalEntry = async () => {
  await db.schema
    .createTable("journalEntry")
    .addColumn("txid", "varchar(255)", (c) => c.primaryKey())
    .addColumn("date", "varchar(255)")
    .addColumn("brief", "varchar(255)")
    .execute();

  const items = journalContext.entries.map(
    (journal): Insertable<JournalEntryTable> => {
      return {
        txid: journal.txid,
        date: journal.date,
        brief: journal.brief,
      };
    },
  );
  await db.insertInto("journalEntry").values(items).execute();
};

const insertBulk_journalEntryLine = async () => {
  await db.schema
    .createTable("journalEntryLine")
    .addColumn("txid", "varchar(255)")
    .addColumn("code", "integer")
    .addColumn("debit", "integer")
    .addColumn("credit", "integer")
    .execute();

  await db.schema
    .createIndex("idx_journalEntryLine_txid")
    .on("journalEntryLine")
    .columns(["txid"])
    .execute();

  const items = journalContext.entries.flatMap((journal) => {
    const lines = journal.lines.map(
      (line): Insertable<JournalEntryLineTable> => {
        const debit = line._tag === "debit" ? line.debit : 0;
        const credit = line._tag === "credit" ? line.credit : 0;

        return {
          code: line.code,
          txid: journal.txid,
          debit,
          credit,
        };
      },
    );
    return lines;
  });

  await db.insertInto("journalEntryLine").values(items).execute();
};

const initializeDatabase = async () => {
  await insertBulk_accountCode();
  await insertBulk_journalEntry();
  await insertBulk_journalEntryLine();
};
initializeDatabase();

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});
