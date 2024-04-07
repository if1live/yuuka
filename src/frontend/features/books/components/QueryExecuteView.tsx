import { sql } from "kysely";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, FormField } from "semantic-ui-react";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ query: string }>({
    defaultValues: {
      query: "SELECT * FROM account LIMIT 10",
    },
  });

  if (loading) return <p>loading...</p>;

  return (
    <>
      <h1>book</h1>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormField>
          <label>sql</label>
          <input
            {...register("query", {
              required: "query is required",
            })}
            autoComplete="off"
          />
        </FormField>
        <FormField>
          <Button type="submit">execute</Button>
        </FormField>
      </Form>

      {error ? (
        <p>{error.message}</p>
      ) : (
        <QueryResultTable columns={columns} rows={rows} />
      )}
    </>
  );
};
