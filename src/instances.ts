import path from "node:path";
import url from "node:url";
import { Liquid } from "liquidjs";

// https://blog.logrocket.com/alternatives-dirname-node-js-es-modules/
const filename = url.fileURLToPath(import.meta.url);
const dirname = url.fileURLToPath(new URL(".", import.meta.url));
const packagePath = path.join(dirname, "..");
const viewPath = path.join(packagePath, "views");

export const engine = new Liquid({
  root: viewPath,
  extname: ".liquid",
  cache: process.env.NODE_ENV === "production",
});
