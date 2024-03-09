import path from "node:path";
import { assert, describe, it } from "vitest";
import { settings } from "../src/settings.js";

describe("settings", () => {
  it("ok", () => {
    const packagePath = path.join(settings.rootPath, "packages/core");
    assert.strictEqual(packagePath, settings.packagePath);
  });
});
