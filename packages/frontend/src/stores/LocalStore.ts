import type { Database } from "sql.js";
import { prepareSqlJs } from "./core";

const storeName = "files";
const fileId = "book.db";

// IndexedDB 데이터베이스를 열고, "files"라는 이름의 객체 저장소를 생성합니다.
const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myDatabase", 1);

    request.onupgradeneeded = (event) => {
      const target = event.target as IDBOpenDBRequest;
      const db = target.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      const target = event.target as IDBOpenDBRequest;
      resolve(target.result);
    };

    request.onerror = (event) => {
      const target = event.target as IDBOpenDBRequest;
      reject(target.error);
    };
  });
};

type Row = {
  id: string;
  buffer: ArrayBuffer;
};

const save = async (sqlite: Database) => {
  const db = await openDatabase();
  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const row: Row = {
      id: fileId,
      buffer: sqlite.export(),
    };
    const request = store.put(row);

    request.onsuccess = () => {
      resolve(true);
    };

    request.onerror = (event) => {
      const target = event.target as IDBRequest;
      reject(target.error);
    };
  });
};

const loadArrayBuffer = async (): Promise<ArrayBuffer> => {
  const db = await openDatabase();
  const transaction = db.transaction(storeName, "readonly");
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = store.get(fileId);

    request.onsuccess = (event) => {
      const target = event.target as IDBRequest<Row | undefined>;
      if (target.result) {
        resolve(target.result.buffer);
      } else {
        const error = new Error("file not found");
        reject(error);
      }
    };

    request.onerror = (event) => {
      const target = event.target as IDBRequest;
      reject(target.error);
    };
  });
};

const load = async (): Promise<Database> => {
  const buffer = await loadArrayBuffer();
  return initial(buffer);
};

const del = async () => {
  const db = await openDatabase();
  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = store.delete(fileId);

    request.onsuccess = (event) => {
      const target = event.target as IDBRequest;
      resolve(true);
    };

    request.onerror = (event) => {
      const target = event.target as IDBRequest;
      reject(target.error);
    };
  });
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
