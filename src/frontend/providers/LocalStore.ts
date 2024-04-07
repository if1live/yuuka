import localforage from "localforage";
import type { Database } from "sql.js";
import { prepareSqlJs } from "../../rdbms/loader.js";

const fileId = "book.db";

const save = async (database: Database) => {
  const buffer = database.export();
  await localforage.setItem(fileId, buffer);
};

const load = async (): Promise<Database> => {
  const buffer = await localforage.getItem<ArrayBuffer>(fileId);
  if (buffer === null) {
    throw new Error("file not found");
  }
  return initial(buffer);
};

const del = async () => {
  await localforage.removeItem(fileId);
};

const empty = async (): Promise<Database> => {
  const sqlJs = await prepareSqlJs();
  const database = new sqlJs.Database();
  return database;
};

const initial = async (arrayBuffer: ArrayBuffer) => {
  const sqlJs = await prepareSqlJs();
  const database = new sqlJs.Database(new Uint8Array(arrayBuffer));
  return database;
};

export const LocalStore = {
  load,
  save,
  del,
  empty,
  initial,
};
