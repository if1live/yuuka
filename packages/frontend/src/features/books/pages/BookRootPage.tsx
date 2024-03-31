import type { KyselyDB } from "@yuuka/core";
import { useContext } from "react";
import { Button } from "semantic-ui-react";
import type { Database } from "sql.js";
import { DataSourceContext } from "../../../contexts/DataSourceContext";
import { QueryRunner } from "../../../db";
import { LocalStore } from "../../../stores/LocalStore";

const loadAccountCount = (db: KyselyDB, sqlite: Database) => {
  const compiledQuery = db
    .selectFrom("accountCode")
    .select((eb) => eb.fn.count<number>("code").as("cnt"))
    .compile();
  return QueryRunner.executeTakeFirst(compiledQuery, sqlite);
};

export const BookRootPage = () => {
  const dataSource = useContext(DataSourceContext);

  const sqlite = dataSource._tag !== "server" ? dataSource.sqlite : null;
  const db = dataSource._tag !== "server" ? dataSource.db : null;

  if (!sqlite) return <p>no sqlite</p>;
  if (!db) return <p>no db</p>;

  const save = async () => {
    await LocalStore.save(sqlite);
  };

  const rows = loadAccountCount(db, sqlite);
  console.log(rows);

  return (
    <>
      <h1>book</h1>

      <Button onClick={save}>save</Button>
    </>
  );
};
