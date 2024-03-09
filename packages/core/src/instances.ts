import path from "node:path";
import * as R from "remeda";
import { JournalEntryLoader } from "./journals/JournalEntryLoader.js";
import { settings } from "./settings.js";

const financialReportsDir = "personal-financial-statements";
const financialReportsPath = path.resolve(
  settings.rootPath,
  "..",
  financialReportsDir,
);

// TODO: journal은 가변데이터가 가까운데 어디에서 취급하지?
const journalPath = path.join(financialReportsPath, "journals");
export const journalContext = R.pipe(
  await JournalEntryLoader.read(journalPath, "journal_2024_03.csv"),
  (x) => JournalEntryLoader.convert(x),
);
