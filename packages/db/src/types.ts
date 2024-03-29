import type { EntitySchemaColumnOptions, EntitySchemaOptions } from "typeorm";

export type MyEntitySchemaColumnOptions = Omit<
  EntitySchemaColumnOptions,
  "name"
> & {
  name: {
    native: string;
    kysely: string;
  };
};

export type MyEntitySchemaOptions<T = unknown> = Omit<
  EntitySchemaOptions<T>,
  "name" | "tableName"
> & {
  name: {
    native: string;
    kysely: string;
    typeorm: string;
  };
};
