import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { AccountCodeLoader } from "../../src/synchronizations/AccountCodeLoader.js";
import type {
  AccountCodeRecord,
  AccountGroupRecord,
} from "../../src/synchronizations/AccountCodeLoader.js";

describe("AccountCodeLoader", () => {
  const accountGroupRecords: AccountGroupRecord[] = [
    {
      major: "자산",
      minor: "당좌자산",
      code: 102,
      name: "현금",
      description: "",
    },
  ];

  const accountCodeRecords: AccountCodeRecord[] = [
    {
      code: 102002,
      name: "국민 월급",
      unit: "KRW",
      description: "",
    },
  ];

  const data = AccountCodeLoader.convert({
    accountGroupRecords,
    accountCodeRecords,
  });
  const { accountGroups, accounts } = data;

  it("account group", () => {
    const actual = accountGroups[0];
    assert.ok(actual);

    assert.equal(actual.major, "asset");
    assert.equal(actual.minor, "당좌자산");
    assert.equal(actual.code, 102);
    assert.equal(actual.name, "현금");
    assert.equal(actual.description, "");
  });

  it("account code: root", () => {
    const actual = accounts.find((x) => x.code === 102_000);
    assert.ok(actual);

    assert.equal(actual.code, 102_000);
    assert.equal(actual.name, "현금");
    assert.equal(actual.description, "");
  });

  it("account code: custom", () => {
    const actual = accounts.find((x) => x.code === 102_002);
    assert.ok(actual);

    assert.equal(actual.code, 102_002);
    assert.equal(actual.name, "국민 월급");
    assert.equal(actual.description, "");
  });
});
