import path from "node:path";
import * as R from "remeda";
import { JournalEntryLoader } from "./journals/JournalEntryLoader.js";
import { AccountCodeLoader } from "./masterdata/AccountCodeLoader.js";
import { settings } from "./settings.js";

const financialReportsDir = "personal-financial-statements";
const financialReportsPath = path.resolve(
  settings.rootPath,
  "..",
  financialReportsDir,
);

// TODO: masterdata
// const sheetPath = path.join(financialReportsPath, "sheets");
// const masterdata_account = R.pipe(
//   await AccountCodeLoader.read(sheetPath),
//   (x) => AccountCodeLoader.convert(x),
// );
// console.log(masterdata_account.accountCodes);

const journalPath = path.join(financialReportsPath, "journals");
const journalEntries = R.pipe(
  await JournalEntryLoader.read(journalPath, "journal_2024_03.csv"),
  (x) => JournalEntryLoader.convert(x),
);
console.log(JSON.stringify(journalEntries, null, 2));
