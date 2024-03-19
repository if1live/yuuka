import type { Insertable, Selectable, Updateable } from "kysely";
import type { PascalCase, SnakeCase } from "type-fest";
import type { MyEntitySchemaOptions } from "../types.js";
import {
  convertTypeormSchemaColumnOptions,
  defineColumn,
} from "../utils/index.js";

const kyselyName = "journalEntryLine";
const nativeName: SnakeCase<typeof kyselyName> = "journal_entry_line";
const typeormName: PascalCase<typeof kyselyName> = "JournalEntryLine";
export const name = kyselyName;

// debit, credit을 rdbms enum 없으 타입스크립트 수준에서 구분하고 싶다.
// 둘을 묶어서 부를 이름은 생각나지 않았다
export const debitTag = 1;
export const creditTag = 2;

export type DebitTag = typeof debitTag;
export type CreditTag = typeof creditTag;

const createColumnList = () => {
  const entryId = defineColumn({
    name: { native: "entry_id", kysely: "entryId" },
    primary: true,
    type: String,
    length: 191,
  });

  const code = defineColumn({
    name: { native: "code", kysely: "code" },
    primary: true,
    type: "int",
  });

  // debit/credit을 따로 쓰는것도 생각해봤는데
  // debit, credit 둘중 하나에만 값이 들어간다.
  // flag로 쓰면 nullable 없이 표현할수 있는 이점이 있다
  // 테이블과 분개장 규격이 1:1이 아닌건 어쩔수 없지만 이건 다른 기법을 쓰는게 나을듯
  const tag = defineColumn({
    name: { native: "tag", kysely: "tag" },
    type: Number,
  });

  // TODO: decimal을 int로 바꿀 가능성 있음
  // KRW만 쓰면 소수점 없어도 되는데 USD도 지원하고 싶다.
  // decimal 쓰면 pg에서는 '11500.00' 같이 문자열로 전달되는걸 처리해야한다.
  // decimal 정밀도는 node에서 다루는게 되나? 그냥 int로 취급하는게 간단할지도?
  const amount = defineColumn({
    name: { native: "amount", kysely: "amount" },
    // type: "decimal",
    // precision: 10,
    // scale: 2,
    type: "int",
  });

  return [entryId, code, tag, amount];
};

const columns = createColumnList();

// TODO: 타입 유도? columns
export interface Table {
  entryId: string;
  code: number;
  tag: DebitTag | CreditTag;
  amount: number;
}

// TODO: 타입 유도?
export const primaryKeyFields = ["entryId", "code"] as const;
export type PrimaryKey = Pick<Table, (typeof primaryKeyFields)[number]>;

// 자주 쓰는 타입이라서 미리 정의
export type Row = Selectable<Table>;
export type NewRow = Insertable<Table>;
export type RowUpdate = Updateable<Table>;

export const options: MyEntitySchemaOptions = {
  name: {
    kysely: kyselyName,
    native: nativeName,
    typeorm: typeormName,
  },
  columns: Object.fromEntries(columns.map(convertTypeormSchemaColumnOptions)),
  indices: [
    // TODO: 원장 ledger 에서의 계정코드+날짜 조회
    // {
    //   name: `${nativeName}_code_date`,
    //   columns: ["code", "date"],
    // },
    // 분개장 journalEntry 에서의 날짜 조회
    // {
    //   name: `${nativeName}_date`,
    //   columns: ["date"],
    // },
  ],
};
