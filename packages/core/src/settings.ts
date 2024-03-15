import path from "node:path";
import url from "node:url";

const NODE_ENV = process.env.NODE_ENV || "development";
const STAGE = process.env.STAGE || "dev";

const TOKEN_SECRET = process.env.TOKEN_SECRET || "helloworld";

const defaultDatabaseUrl =
  "postgres://localhost_dev:localhost_dev@localhost/localhost_dev";
const testDatabaseUrl = ":memory:";

const databaseUrl =
  process.env.NODE_ENV !== "test"
    ? process.env.DATABASE_URL || defaultDatabaseUrl
    : testDatabaseUrl;

// https://blog.logrocket.com/alternatives-dirname-node-js-es-modules/
const filename = url.fileURLToPath(import.meta.url);
const dirname = url.fileURLToPath(new URL(".", import.meta.url));
const packagePath = path.join(dirname, "..");
const rootPath = path.join(packagePath, "..", "..");

const viewPath = path.join(packagePath, "views");
const staticPath = path.join(packagePath, "static");
const privPath = path.join(packagePath, "priv");

export const settings = {
  NODE_ENV,
  STAGE,

  TOKEN_SECRET,

  databaseUrl,

  rootPath,
  packagePath,
  viewPath,
  staticPath,
  privPath,
};
