export type AccountCategory =
  | "asset"
  | "liability"
  | "equity"
  | "revenue"
  | "expense";

type AccountCategoryMapping = {
  [key in AccountCategory]: string;
};

/**
 * CSV, 프론트엔드에서는 한글 용어로 쓰고싶다.
 * 하지만 코드에서는 영어만 쓰고싶다.
 */
const mapping_korean: AccountCategoryMapping = {
  asset: "자산",
  liability: "부채",
  equity: "자본",
  revenue: "수익",
  expense: "비용",
};

/**
 * 코드 수준에서는 asset, expanse 같은 용어를 쓰고싶다.
 * ledger file format으로 보낼때는 문서에 등장하는 용어로 쓰고싶다.
 * https://ledger-cli.org/doc/ledger3.html
 */
const mapping_ledger: AccountCategoryMapping = {
  asset: "Assets",
  liability: "Liabilities",
  equity: "Equity",
  revenue: "Income",
  expense: "Expenses",
};

const toDisplayName = (table: AccountCategoryMapping) => {
  return (category: AccountCategory) => {
    return table[category];
  };
};

const fromDisplayName = (table: AccountCategoryMapping) => {
  return (name: string): AccountCategory => {
    const found = Object.keys(table).find(
      (key) => table[key as AccountCategory] === name,
    ) as AccountCategory;
    if (!found) {
      throw new Error(`Unknown account category name: ${name}`);
    }
    return found;
  };
};

const toKorean = toDisplayName(mapping_korean);
const fromKorean = fromDisplayName(mapping_korean);

const toLedger = toDisplayName(mapping_ledger);
const fromLedger = fromDisplayName(mapping_ledger);

export const AccountCategory = {
  toKorean,
  fromKorean,

  toLedger,
  fromLedger,
};
