import type { Database } from "sql.js";
import { supabase } from "../constants";
import { prepareSqlJs } from "./core";

const bucket = "yuuka";

const getBookFilePath = (userId: string) => `${userId}/book.db`;

const upload = async (userId: string, sqlite: Database) => {
  const fp = getBookFilePath(userId);
  const bytes = sqlite.export();

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fp, bytes, {
      upsert: true,
      contentType: "application/x-sqlite3",
      cacheControl: "10",
    });

  if (error) throw error;

  return data;
};

const downloadArrayBuffer = async (userId: string): Promise<ArrayBuffer> => {
  const fp = getBookFilePath(userId);
  const { data, error } = await supabase.storage.from(bucket).download(fp);
  if (error) throw error;

  const arrayBuffer = await data.arrayBuffer();
  return arrayBuffer;
};

const download = async (userId: string): Promise<Database> => {
  const sqlJs = await prepareSqlJs();
  const buffer = await downloadArrayBuffer(userId);
  const database = new sqlJs.Database(new Uint8Array(buffer));
  return database;
};

export const RemoteStore = {
  upload,
  download,
};
