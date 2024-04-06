export type AccountCategory =
  | "asset"
  | "liability"
  | "equity"
  | "revenue"
  | "expense";

type AccountCategoryName = {
  [key in AccountCategory]: string;
};

/**
 * CSV, 프론트엔드에서는 한글 용어로 쓰고싶다.
 * 하지만 코드에서는 영어만 쓰고싶다.
 */
const accountCategoryNames: AccountCategoryName = {
  asset: "자산",
  liability: "부채",
  equity: "자본",
  revenue: "수익",
  expense: "비용",
};

const toKorean = (category: AccountCategory) => {
  return accountCategoryNames[category];
};

const fromKorean = (name: string): AccountCategory => {
  const found = Object.keys(accountCategoryNames).find(
    (key) => accountCategoryNames[key as AccountCategory] === name,
  ) as AccountCategory;
  if (!found) {
    throw new Error(`Unknown account category name: ${name}`);
  }
  return found;
};

export const AccountCategory = {
  toKorean,
  fromKorean,
};
