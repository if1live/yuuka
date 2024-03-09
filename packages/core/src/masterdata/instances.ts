import path from "node:path";
import * as R from "remeda";
import { settings } from "../settings.js";
import { AccountCodeLoader } from "./AccountCodeLoader.js";

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

/**
 * 마스터데이터는 한번만 불러오면 불변
 */
export const MasterData = Object.freeze({
  accountCodes: masterdata_account.accountCodes,
  accountTags: masterdata_account.accountTags,
});
