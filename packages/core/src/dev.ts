import { serve } from "@hono/node-server";
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

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});
