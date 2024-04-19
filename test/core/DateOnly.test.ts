import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { DateOnly } from "../../src/core/types.js";

describe("DateOnly.schema", () => {
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
