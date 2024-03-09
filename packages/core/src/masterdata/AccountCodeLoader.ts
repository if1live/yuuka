import assert from "node:assert";
import fs from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import * as R from "remeda";
import { z } from "zod";
import type { AccountCategory, AccountCode, AccountTag } from "./types.js";

/**
 * csv -> typescript record
 * record는 입출력 규격이라서 로직을 넣지 않는다.
 */

type ParseFn<T> = (input: string) => T[];

// account tag
const accountTagSchema = z.object({
  major: z.enum(["자산", "부채", "자본", "수익", "비용"]),
  minor: z.string(),
  code: z.coerce.number(),
  name: z.string(),
  description: z.string(),
});
export type AccountTagRecord = z.infer<typeof accountTagSchema>;

const parseAccountTagSheet: ParseFn<AccountTagRecord> = (input) => {
  const records = parse(input, {
    columns: true,
    skip_empty_lines: true,
  });

  const results = records.map((r: unknown) => accountTagSchema.parse(r));
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
  const records = parse(input, {
    columns: true,
    skip_empty_lines: true,
  });

  const results = records.map((r: unknown) => accountCodeSchema.parse(r));
  return results;
};

// masterdata

/**
 * CSV에 기록되는건 가급적 한글 용어로 쓰고싶다.
 * 하지만 코드에서는 영어만 쓰고싶다.
 */
const convertHangulMajorToAccountCategory = (
  x: AccountTagRecord["major"],
): AccountCategory => {
  const table: Record<AccountTagRecord["major"], AccountCategory> = {
    자산: "asset",
    부채: "liability",
    자본: "equity",
    수익: "revenue",
    비용: "expense",
  };
  return table[x];
};

const convertAccountTags = (
  accountTagRecords: AccountTagRecord[],
): AccountTag[] => {
  return accountTagRecords.map((x): AccountTag => {
    return {
      major: convertHangulMajorToAccountCategory(x.major),
      minor: x.minor,
      code: x.code,
      name: x.name,
      description: x.description,
    };
  });
};

const convertAccountCodes = (args: {
  accountTags: AccountTag[];
  accountCodeRecords: AccountCodeRecord[];
}): AccountCode[] => {
  const { accountTags, accountCodeRecords } = args;

  const accountTagMap = new Map<number, AccountTag>(
    accountTags.map((tag) => [tag.code, tag]),
  );

  const accountCodes_parent = accountTags.map((x): AccountCode => {
    const tag = accountTagMap.get(x.code);
    assert.ok(tag, `tag not found for code ${x.code}`);

    return {
      code: x.code * 1000,
      name: x.name,
      description: x.description,
    };
  });

  const accountCodes_custom = accountCodeRecords.map((x): AccountCode => {
    const tagCode = Math.floor(x.code / 1000);
    const tag = accountTagMap.get(tagCode);
    assert.ok(tag, `tag not found for code ${x.code}`);

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
  accountTagRecords: AccountTagRecord[];
  accountCodeRecords: AccountCodeRecord[];
};

const convertRoot = (context: RecordContext) => {
  const { accountCodeRecords, accountTagRecords } = context;

  const accountTags = convertAccountTags(accountTagRecords);
  const accountCodes = convertAccountCodes({
    accountTags,
    accountCodeRecords,
  });

  return { accountTags, accountCodes };
};

const readRoot = async (rootPath: string): Promise<RecordContext> => {
  const loadFile = async <T>(filename: string, parseText: ParseFn<T>) => {
    const fp = path.join(rootPath, filename);
    const text = await fs.readFile(fp, "utf8");
    return parseText(text);
  };

  const [accountTagRecords, accountCodeRecords] = await Promise.all([
    loadFile("AccountTag.csv", parseAccountTagSheet),
    loadFile("AccountCode.csv", parseAccountCodeSheet),
  ]);

  return { accountTagRecords, accountCodeRecords };
};

export const AccountCodeLoader = {
  read: readRoot,
  convert: convertRoot,
};
