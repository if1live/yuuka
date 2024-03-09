import path from "node:path";
import * as R from "remeda";
import { AccountCodeLoader } from "./masterdata/AccountCodeLoader.js";
import { settings } from "./settings.js";

const financialReportsDir = "personal-financial-statements";
const financialReportsPath = path.resolve(
  settings.rootPath,
  "..",
  financialReportsDir,
);

const sheetPath = path.join(financialReportsPath, "sheets");
const journalPath = path.join(financialReportsPath, "journals");

const masterdata_account = R.pipe(
  await AccountCodeLoader.read(sheetPath),
  (x) => AccountCodeLoader.convert(x),
);
console.log(masterdata_account.accountCodes);
