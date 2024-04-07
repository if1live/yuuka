import { Hono } from "hono";
import type { MyKysely } from "../rdbms/types.js";

type MyBindings = { db: MyKysely };

export const createHonoApp = () => {
  return new Hono<{ Bindings: MyBindings }>();
};
