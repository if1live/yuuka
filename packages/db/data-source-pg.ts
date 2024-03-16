import "reflect-metadata";
import { DataSource } from "typeorm";
import { entitySchemaList } from "./internal/entities.js";

export const AppDataSource = new DataSource({
  type: "postgres",

  host: "localhost",
  port: 5432,
  username: "localhost_dev",
  password: "localhost_dev",
  database: "localhost_dev",

  // migration 생성 목적으로만 사용할거라 synchronize 비활성화
  synchronize: false,
  logging: false,

  entities: entitySchemaList,

  // rdbms에서 테이블 목록 뽑았을때 뒤섞이는거 피하고 싶어서 특수한 이름 사용
  // 쓸 수 있는 prefix는 현실적으로 0 or z 밖에 없고 둘 중에는 0이 나을듯
  // z는 진짜로 테이블 이름에서 사용될지 모르니까
  migrationsTableName: "00_migrations",

  migrations: ["migrations/*.ts"],
  subscribers: ["subscribers/*.ts"],
});
