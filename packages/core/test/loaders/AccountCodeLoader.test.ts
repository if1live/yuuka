import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { AccountCodeLoader } from "../../src/loaders/AccountCodeLoader.js";
import type {
  AccountCodeRecord,
  AccountTagRecord,
} from "../../src/loaders/AccountCodeLoader.js";

describe("AccountCodeLoader", () => {
  const accountTagRecords: AccountTagRecord[] = [
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
    accountTagRecords,
    accountCodeRecords,
  });
  const { accountTags, accountCodes } = data;

  it("account tag", () => {
    const actual = accountTags[0];
    assert.ok(actual);

    assert.equal(actual.major, "asset");
    assert.equal(actual.minor, "당좌자산");
    assert.equal(actual.code, 102);
    assert.equal(actual.name, "현금");
    assert.equal(actual.description, "");
  });

  it("account code: root", () => {
    const actual = accountCodes.find((x) => x.code === 102_000);
    assert.ok(actual);

    assert.equal(actual.code, 102_000);
    assert.equal(actual.name, "현금");
    assert.equal(actual.description, "");
  });

  it("account code: custom", () => {
    const actual = accountCodes.find((x) => x.code === 102_002);
    assert.ok(actual);

    assert.equal(actual.code, 102_002);
    assert.equal(actual.name, "국민 월급");
    assert.equal(actual.description, "");
  });
});
