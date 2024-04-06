import { Hono } from "hono";
import type { MyKysely } from "../rdbms/types.js";

export const createControllerApp = () => {
  return new Hono<{
    Bindings: { db: MyKysely };
  }>();
};
