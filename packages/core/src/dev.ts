import path from "node:path";
import * as R from "remeda";
import { JournalEntry } from "./journals/JournalEntry.js";
import { JournalEntryLoader } from "./journals/JournalEntryLoader.js";
import { AccountCodeLoader } from "./masterdata/AccountCodeLoader.js";
import { settings } from "./settings.js";

const financialReportsDir = "personal-financial-statements";
const financialReportsPath = path.resolve(
  settings.rootPath,
  "..",
  financialReportsDir,
);

const sheetPath = path.join(financialReportsPath, "sheets");
const masterdata_account = R.pipe(
  await AccountCodeLoader.read(sheetPath),
  (x) => AccountCodeLoader.convert(x),
);

const journalPath = path.join(financialReportsPath, "journals");
const journalContext = R.pipe(
  await JournalEntryLoader.read(journalPath, "journal_2024_03.csv"),
  (x) => JournalEntryLoader.convert(x),
);

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
