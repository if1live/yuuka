import fs from "node:fs/promises";
import path from "node:path";
import * as csv from "csv/sync";
import * as R from "remeda";
import { z } from "zod";
import { Account } from "../accounts/models/Account.js";
import { AccountCategory } from "../accounts/models/AccountCategory.js";
import type { AccountGroup } from "../accounts/models/AccountGroup.js";

/**
 * csv -> typescript record
 * record는 입출력 규격이라서 로직을 넣지 않는다.
 */

type ParseFn<T> = (input: string) => T[];

// account group
const accountGroupSchema = z.object({
  major: z.enum(["자산", "부채", "자본", "수익", "비용"]),
  minor: z.string(),
  code: z.coerce.number(),
  name: z.string(),
  description: z.string(),
});
export type AccountGroupRecord = z.infer<typeof accountGroupSchema>;

const parseAccountGroupSheet: ParseFn<AccountGroupRecord> = (input) => {
  const records = csv.parse(input, {
    columns: true,
    skip_empty_lines: true,
  });

  const results = records.map((r: unknown) => accountGroupSchema.parse(r));
  return results;
};

// account code
const accountCodeSchema = z.object({
  code: z.coerce.number(),
  name: z.string(),
  unit: z.string(),
  description: z.string(),
});
export type AccountCodeRecord = z.infer<typeof accountCodeSchema>;

const parseAccountCodeSheet: ParseFn<AccountCodeRecord> = (input) => {
  const records = csv.parse(input, {
    columns: true,
    skip_empty_lines: true,
  });

  const results = records.map((r: unknown) => accountCodeSchema.parse(r));
  return results;
};

const convertAccountGroups = (
  accountGroupRecords: AccountGroupRecord[],
): AccountGroup[] => {
  return accountGroupRecords.map((x): AccountGroup => {
    return {
      major: AccountCategory.fromKorean(x.major),
      minor: x.minor,
      code: x.code,
      name: x.name,
      description: x.description,
    };
  });
};

const convertAccounts = (args: {
  accountGroups: AccountGroup[];
  accountCodeRecords: AccountCodeRecord[];
}): Account[] => {
  const { accountGroups, accountCodeRecords } = args;

  const accountGroupMap = new Map<number, AccountGroup>(
    accountGroups.map((x) => [x.code, x]),
  );

  const accountCodes_parent = accountGroups.map((x): Account => {
    const group = accountGroupMap.get(x.code);
    if (!group) {
      throw new Error(`group not found for code ${x.code}`);
    }

    return {
      code: x.code * 1000,
      name: x.name,
      description: x.description,
    };
  });

  const accountCodes_custom = accountCodeRecords.map((x): Account => {
    const groupCode = Account.toGroup(x.code);
    const group = accountGroupMap.get(groupCode);
    if (!group) {
      throw new Error(`group not found for code ${x.code}`);
    }

    return {
      code: x.code,
      name: x.name,
      description: x.description,
    };
  });

  const accountCodes = R.pipe(
    [...accountCodes_parent, ...accountCodes_custom],
    R.sortBy((x) => x.code),
  );

  return accountCodes;
};

type RecordContext = {
  accountGroupRecords: AccountGroupRecord[];
  accountCodeRecords: AccountCodeRecord[];
};

const convertRoot = (context: RecordContext) => {
  const { accountCodeRecords, accountGroupRecords } = context;

  const accountGroups = convertAccountGroups(accountGroupRecords);
  const accounts = convertAccounts({
    accountGroups: accountGroups,
    accountCodeRecords,
  });

  return { accountGroups, accounts };
};

const readRoot = async (rootPath: string): Promise<RecordContext> => {
  const loadFile = async <T>(filename: string, parseText: ParseFn<T>) => {
    const fp = path.join(rootPath, filename);
    const text = await fs.readFile(fp, "utf8");
    return parseText(text);
  };

  const [accountGroupRecords, accountCodeRecords] = await Promise.all([
    loadFile("AccountTag.csv", parseAccountGroupSheet),
    loadFile("AccountCode.csv", parseAccountCodeSheet),
  ]);

  return { accountGroupRecords, accountCodeRecords };
};

export const AccountCodeLoader = {
  read: readRoot,
  convert: convertRoot,
};
