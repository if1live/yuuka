import path from "node:path";
import url from "node:url";

const defaultDatabaseUrl = "postgres://postgres:postgres@localhost/shiroko_dev";
const databaseUrl = process.env.DATABASE_URL || defaultDatabaseUrl;

// https://blog.logrocket.com/alternatives-dirname-node-js-es-modules/
const filename = url.fileURLToPath(import.meta.url);
const dirname = url.fileURLToPath(new URL(".", import.meta.url));
const packagePath = path.join(dirname, "..");
const rootPath = path.join(packagePath, "..", "..");

const viewPath = path.join(packagePath, "views");
const staticPath = path.join(packagePath, "static");
const privPath = path.join(packagePath, "priv");

export const settings = {
  databaseUrl,

  rootPath,
  packagePath,
  viewPath,
  staticPath,
  privPath,
};
