import { Button, Input } from "@mantine/core";
import { sql } from "kysely";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Database } from "sql.js";
import { QueryRunner } from "../../../../rdbms/index.js";
import type { MyKysely } from "../../../../rdbms/types.js";
import { QueryResultTable } from "./QueryResultTable.js";

const execute = (db: MyKysely, sqlite: Database, query: string) => {
  const fragment = query as unknown as TemplateStringsArray;
  const compiledQuery = sql(fragment).compile(db);
  return QueryRunner.exec<Record<string, unknown>>(compiledQuery, sqlite);
};

export const QueryExecuteView = (props: {
  db: MyKysely;
  sqlite: Database;
}) => {
  const { db, sqlite } = props;

  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ query: string }>({
    defaultValues: {
      query: "SELECT * FROM account LIMIT 10",
    },
  });

  const onSubmit = (data: { query: string }) => {
    setLoading(true);
    try {
      const result = execute(db, sqlite, data.query);
      setColumns(result.columns);
      setRows(result.rows);
      setError(null);
    } catch (e) {
      setColumns([]);
      setRows([]);
      setError(e as Error);
    }
    setLoading(false);
  };

  if (loading) return <p>loading...</p>;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input.Wrapper label="sql">
          <input
            {...register("query", {
              required: "query is required",
            })}
            autoComplete="off"
          />
        </Input.Wrapper>

        <Button type="submit">execute</Button>
      </form>

      {error ? (
        <p>{error.message}</p>
      ) : (
        <QueryResultTable columns={columns} rows={rows} />
      )}
    </>
  );
};
