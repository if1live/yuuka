import type SQLite from "better-sqlite3";
import type { Dialect } from "kysely";
import { SqliteDialect } from "kysely";
import type { DataSource, Driver } from "typeorm";
import type { BetterSqlite3Driver } from "typeorm/driver/better-sqlite3/BetterSqlite3Driver.js";

function isBetterSqlite3Driver(driver: Driver): driver is BetterSqlite3Driver {
  const type = driver.options.type;
  return type === "better-sqlite3";
}

const createDialect_sqlite = (driver: BetterSqlite3Driver): Dialect => {
  // typeorm 초기화 이전에 접근하면 databaseConnection이 비어있다.
  const database = driver.databaseConnection as
    | SQLite.Database
    | undefined
    | null;

  if (!database) {
    throw new Error("databaseConnection is not initialized");
  }

  return new SqliteDialect({
    database,
  });
};

const createDialect = (dataSource: DataSource): Dialect => {
  if (isBetterSqlite3Driver(dataSource.driver)) {
    return createDialect_sqlite(dataSource.driver);
  }

  // else...
  throw new Error("unsupported driver");
};

export const TestDatabase = {
  dialect: createDialect,
};
