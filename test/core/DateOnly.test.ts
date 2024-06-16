import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { DateOnly } from "../../src/core/types.js";

describe("DateOnly#schema", () => {
  it("2012-03-04", () => {
    const input = "2012-03-04";
    const actual = DateOnly.schema.parse(input);
    assert.strictEqual(actual, input);
  });

  it("invalid type", () => {
    assert.throws(() => DateOnly.schema.parse(123), {
      message: "must be a string",
    });
  });

  it("invalid format", () => {
    assert.throws(() => DateOnly.schema.parse("2012-03-04T00:00:00.000Z"), {
      message: "invalid date format",
    });
  });
});

describe("DateOnly#split", () => {
  it("ok", () => {
    const input: DateOnly = "2012-08-09";
    const actual = DateOnly.split(input);
    assert.strictEqual(actual.year, 2012);
    assert.strictEqual(actual.month, 8);
    assert.strictEqual(actual.day, 9);
  });
});

describe("DateOnly#fromDate", () => {
  const timezoneOffset = new Date().getTimezoneOffset();
  const timezone_kst = -9 * 60;

  it.skipIf(timezoneOffset !== timezone_kst)("UTC날짜 == KST날짜", () => {
    const date = new Date("2024-04-19T12:00:00.000Z");
    const actual = DateOnly.fromDate(date);
    const expected: DateOnly = "2024-04-19";
    assert.strictEqual(actual, expected);
  });

  it.skipIf(timezoneOffset !== timezone_kst)("UTC날짜 != KST날짜", () => {
    const date = new Date("2024-04-19T23:00:00.000Z");
    const actual = DateOnly.fromDate(date);
    const expected: DateOnly = "2024-04-20";
    assert.strictEqual(actual, expected);
  });
});

describe("DateOnly#addDay", () => {
  it("월의 경계를 안넘음", () => {
    const input: DateOnly = "2024-04-19";
    const actual = DateOnly.addDay(input, 1);
    const expected: DateOnly = "2024-04-20";
    assert.strictEqual(actual, expected);
  });

  it("월의 경계를 넘음", () => {
    const input: DateOnly = "2024-04-30";
    const actual = DateOnly.addDay(input, 1);
    const expected: DateOnly = "2024-05-01";
    assert.strictEqual(actual, expected);
  });
});
