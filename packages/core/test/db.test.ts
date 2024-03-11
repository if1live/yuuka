import { describe, it, assert, beforeAll, afterAll } from "vitest";
import { db } from "../src/db.js";
import { after } from "node:test";

describe("db", () => {
  beforeAll(async () => {
    await db.initialize();
  });

  afterAll(async () => {
    await db.destroy();
  });
});
