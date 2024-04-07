import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { dateSchema } from "../../src/core/types.js";

describe("dateSchema", () => {
  it("2012-03-04", () => {
    const input = "2012-03-04";
    const actual = dateSchema.parse(input);
    assert.strictEqual(actual, input);
  });

  it("invalid type", () => {
    assert.throws(() => dateSchema.parse(123), {
      message: "must be a string",
    });
  });

  it("invalid format", () => {
    assert.throws(() => dateSchema.parse("2012-03-04T00:00:00.000Z"), {
      message: "invalid date format",
    });
  });
});
