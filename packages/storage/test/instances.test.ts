import path from "node:path";
import { assert, describe, it } from "vitest";
import { settings } from "../src/instances.js";

describe("settings", () => {
  it("ok", () => {
    const packagePath = path.join(settings.rootPath, "packages/storage");
    assert.strictEqual(packagePath, settings.packagePath);
  });
});
