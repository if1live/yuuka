import "reflect-metadata";
import { DataSource } from "typeorm";
import { entitySchemaList } from "./internal/entities.js";

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: ":memory:",
  synchronize: false,
  logging: false,
  entities: entitySchemaList,
});
