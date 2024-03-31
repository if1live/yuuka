import { MyDatabase } from "@yuuka/core";
import { Button } from "semantic-ui-react";
import { DataSourceValue } from "../contexts/DataSourceContext";
import { LocalStore } from "../stores/LocalStore";
import { type DataSourceNodeProps, createApp } from "./dataSourceNodes";

export const DataSourceNode_Blank = (props: DataSourceNodeProps) => {
  const { setDataSource, setError } = props;

  const load = async () => {
    try {
      const sqlite = await LocalStore.empty();
      const dialect = DataSourceValue.createDialect(sqlite);
      const db = DataSourceValue.createKysely(dialect);
      await MyDatabase.createSchema(db);

      const app = createApp(db);
      setDataSource({ _tag: "sandbox", sqlite, db, app });
    } catch (e) {
      setError(e as Error);
    }
  };

  return (
    <>
      <h3>blank project</h3>
      <Button type="button" onClick={load}>
        start
      </Button>
    </>
  );
};
