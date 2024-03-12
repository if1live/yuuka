import type { EntitySchemaColumnOptions } from "typeorm";
import type { MyEntitySchemaColumnOptions } from "../types.js";

export const defineColumn = <T extends MyEntitySchemaColumnOptions>(
  opts: T,
) => {
  return opts;
};

export const convertTypeormSchemaColumnOptions = (
  input: MyEntitySchemaColumnOptions,
) => {
  const { name, ...rest } = input;
  const opts: EntitySchemaColumnOptions = {
    ...rest,
    name: name.native,
  };
  return [name.native, opts] as const;
};
export interface AccountCodeTable {
  code: number;
  name: string;
  description: string;
}
