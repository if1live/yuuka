import type { Database } from "sql.js";
import { supabase } from "../constants";

const bucket = "yuuka";

const getBookFilePath = (userId: string) => `${userId}/book.db`;

export const uploadBook = async (userId: string, sqlite: Database) => {
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

export const downloadBook = async (userId: string) => {
  const fp = getBookFilePath(userId);
  const { data, error } = await supabase.storage.from(bucket).download(fp);
  if (error) throw error;

  const arrayBuffer = await data.arrayBuffer();
  return arrayBuffer;
};
