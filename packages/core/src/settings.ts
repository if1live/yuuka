const NODE_ENV = process.env.NODE_ENV || "development";
const STAGE = process.env.STAGE || "dev";

const defaultDatabaseUrl = "sqlite.db";
const testDatabaseUrl = ":memory:";

const databaseUrl =
  process.env.NODE_ENV !== "test"
    ? process.env.DATABASE_URL || defaultDatabaseUrl
    : testDatabaseUrl;

export const settings = {
  NODE_ENV,
  STAGE,

  databaseUrl,
};
