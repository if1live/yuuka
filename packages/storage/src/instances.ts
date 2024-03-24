import path from "node:path";
import url from "node:url";
import { StorageClient } from "@supabase/storage-js";
import { Liquid } from "liquidjs";
import { z } from "zod";

const NODE_ENV = process.env.NODE_ENV || "development";
const STAGE = process.env.STAGE || "dev";

// 람다도 뜯고 supabase 직접 쓰게 바꾸는게 나을거같은데
// supabase 프론트엔드 삽질하기 귀찮아서 당장은 람다를 거치도록
const processSchema = z.object({
  SUPABASE_PROJECT_REF: z.string().default(""),
  SUPABASE_SERVICE_KEY: z.string().default(""),
});

const env = processSchema.parse(process.env);

const STORAGE_URL = `https://${env.SUPABASE_PROJECT_REF}.supabase.co/storage/v1`;
const SERVICE_KEY = env.SUPABASE_SERVICE_KEY;

export const storageClient = new StorageClient(STORAGE_URL, {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
});

// https://blog.logrocket.com/alternatives-dirname-node-js-es-modules/
const filename = url.fileURLToPath(import.meta.url);
const dirname = url.fileURLToPath(new URL(".", import.meta.url));
const packagePath = path.join(dirname, "..");
const rootPath = path.join(packagePath, "..", "..");

const viewPath = path.join(packagePath, "views");
const staticPath = path.join(packagePath, "static");
const privPath = path.join(packagePath, "priv");

export const settings = {
  rootPath,
  packagePath,
  viewPath,
  staticPath,
  privPath,

  // TODO: supabase 토큰 뜯는 방법?
  TOKEN_SECRET: "secret",
};

export const engine = new Liquid({
  root: settings.viewPath,
  extname: ".liquid",
  cache: NODE_ENV === "production",
});
