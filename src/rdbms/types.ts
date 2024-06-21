import type { Kysely } from "kysely";
import { AccountTable, PresetLineTable, PresetTable } from "../tables/index.js";

/**
 * Database 쓰면 sqlite같은것과 이름 겹쳐서 원하지 않은 형태로 자동완성된다.
 * 이를 피하려고 이름을 다르게 쓴다.
 */
export interface MyDatabase {
  [AccountTable.name]: AccountTable.Table;
  [PresetLineTable.name]: PresetLineTable.Table;
  [PresetTable.name]: PresetTable.Table;
}

/** 많은곳에서 사용되는데 import 줄이고 싶어서 단축 정의 */
export type MyKysely = Kysely<MyDatabase>;
