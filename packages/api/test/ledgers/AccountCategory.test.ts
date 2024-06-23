import { assert, describe, it } from "vitest";
import { AccountCategory } from "../../src/ledgers/AccountCategory.js";

describe("AccountCategory", () => {
  it("toKoran", () => {
    const actual = AccountCategory.toKorean("asset");
    assert.equal(actual, "자산");
  });

  it("fromLedger", () => {
    const actual = AccountCategory.fromLedger("Assets");
    assert.equal(actual, "asset");
  });
});
