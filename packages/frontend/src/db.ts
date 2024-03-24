import type { CompiledQuery } from "kysely";
import * as R from "remeda";
import type { BindParams, Database, QueryExecResult } from "sql.js";

export type QueryRow<T> = T extends CompiledQuery<infer R> ? R : never;

function execute<T>(compiledQuery: CompiledQuery<T>, sqlite: Database) {
  const results = sqlite.exec(
    compiledQuery.sql,
    compiledQuery.parameters as unknown as BindParams,
  );

  const result = results[0] as QueryExecResult;
  const rows = result.values.map((value) => {
    const entries = R.zip(result.columns, value);
    return Object.fromEntries(entries) as T;
  });

  return rows;
}

function executeTakeFirst<T>(
  compiledQuery: CompiledQuery<T>,
  sqlite: Database,
) {
  const rows = execute(compiledQuery, sqlite);
  return rows[0];
}

function executeTakeFirstOrThrow<T>(
  compiledQuery: CompiledQuery<T>,
  sqlite: Database,
) {
  const rows = execute(compiledQuery, sqlite);
  if (rows.length === 0) {
    throw new Error("No rows found");
  }
  return rows[0];
}

export const QueryRunner = {
  execute,
  executeTakeFirst,
  executeTakeFirstOrThrow,
};
