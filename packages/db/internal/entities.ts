import { EntitySchema } from "typeorm";
import {
  AccountCodeSchema,
  AccountTagSchema,
  JournalEntryLineSchema,
  JournalEntrySchema,
  PreferenceSchema,
} from "../src/entities/index.js";
import type { MyEntitySchemaOptions } from "../src/types.js";

const build = <T>(options: MyEntitySchemaOptions<T>) => {
  const { name, ...rest } = options;
  return new EntitySchema({
    schema: "yuuka",
    name: name.typeorm,
    tableName: name.native,
    ...rest,
  });
};

// 편의상 schema 정의를 그대로 쓰고싶다
const f = <T>(schema: { options: MyEntitySchemaOptions<T> }) => {
  return build(schema.options);
};

export const AccountCodeSchemaEntity = f(AccountCodeSchema);
export const JournalEntryLineSchemaEntity = f(JournalEntryLineSchema);
export const JournalEntrySchemaEntity = f(JournalEntrySchema);
export const PreferenceSchemaEntity = f(PreferenceSchema);
export const AccountTagSchemaEntity = f(AccountTagSchema);

export const entitySchemaList: EntitySchema[] = [
  AccountTagSchemaEntity,
  AccountCodeSchemaEntity,
  JournalEntryLineSchemaEntity,
  JournalEntrySchemaEntity,
  PreferenceSchemaEntity,
];
