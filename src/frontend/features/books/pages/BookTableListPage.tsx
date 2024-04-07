import { sql } from "kysely";
import { useContext } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import type { Database } from "sql.js";
import type { MyDatabase, MyKysely } from "../../../../index.js";
import { QueryRunner } from "../../../../rdbms/index.js";
import { DataSourceContext } from "../../../providers/DataSourceContext.js";

type TableMasterRow = {
  type: string;
  name: string;
  tbl_name: string;
  rootpage: number;
  sql: string;
};

const loadTableList = (db: MyKysely, sqlite: Database) => {
  const text = "SELECT * FROM sqlite_master WHERE type='table'";
  const query = text as unknown as TemplateStringsArray;
  const compiledQuery = sql(query).compile(db);
  return QueryRunner.execute<TableMasterRow>(compiledQuery, sqlite);
};

const loadRowCount = (db: MyKysely, sqlite: Database, table: string) => {
  const compiledQuery = db
    .selectFrom(table as keyof MyDatabase)
    .select((eb) => eb.fn.count<number>("code").as("cnt"))
    .compile();
  const result = QueryRunner.executeTakeFirst(compiledQuery, sqlite);
  return result?.cnt ?? 0;
};

export const BookTableListPage = () => {
  const dataSource = useContext(DataSourceContext);

  const sqlite = dataSource._tag !== "api" ? dataSource.sqlite : null;
  const db = dataSource._tag !== "api" ? dataSource.db : null;

  if (!sqlite) return <p>no sqlite</p>;
  if (!db) return <p>no db</p>;

  const tables = loadTableList(db, sqlite);
  const entries_row = tables.map((t) => {
    const count = loadRowCount(db, sqlite, t.name);
    return [t.name, count] as const;
  });
  const rowCountMap = new Map(entries_row);

  return (
    <Table celled compact="very">
      <TableHeader>
        <TableRow>
          <TableHeaderCell>name</TableHeaderCell>
          <TableHeaderCell>count</TableHeaderCell>
          <TableHeaderCell>etc</TableHeaderCell>
        </TableRow>
      </TableHeader>

      <TableBody>
        {tables.map((t) => (
          <TableRow key={t.name}>
            <TableCell>{t.name}</TableCell>
            <TableCell>{rowCountMap.get(t.name) ?? 0}</TableCell>
            <TableCell>
              <details>
                <summary>sql</summary>
                {t.sql ?? ""}
              </details>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
