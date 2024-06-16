import type { CompiledQuery } from "kysely";
import * as R from "remeda";
import type { BindParams, Database, QueryExecResult } from "sql.js";

export type QueryRow<T> = T extends CompiledQuery<infer R> ? R : never;

// QueryExecResult를 적당히 변환
function exec<T>(
  compiledQuery: CompiledQuery<T>,
  sqlite: Database,
): {
  rows: T[];
  columns: string[];
} {
  const results = sqlite.exec(
    compiledQuery.sql,
    compiledQuery.parameters as unknown as BindParams,
  );

  const result = results[0] as QueryExecResult;
  const rows = result.values.map((value) => {
    const entries = R.zip(result.columns, value);
    return Object.fromEntries(entries) as T;
  });

  return {
    rows,
    columns: result.columns,
  };
}

export function execute<T>(
  compiledQuery: CompiledQuery<T>,
  sqlite: Database,
): T[] {
  const { rows } = exec(compiledQuery, sqlite);
  return rows;
}

export function executeTakeFirst<T>(
  compiledQuery: CompiledQuery<T>,
  sqlite: Database,
): T | undefined {
  const rows = execute(compiledQuery, sqlite);
  return rows[0];
}

export function executeTakeFirstOrThrow<T>(
  compiledQuery: CompiledQuery<T>,
  sqlite: Database,
): T {
  const rows = execute(compiledQuery, sqlite);
  const [row] = rows;
  if (!row) {
    throw new Error("No rows found");
  }
  return row;
}
