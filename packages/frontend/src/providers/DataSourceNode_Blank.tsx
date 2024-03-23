import { Database } from "@yuuka/db";
import { Button } from "semantic-ui-react";
import { DataSourceValue } from "../contexts/DataSourceContext";
import { type DataSourceNodeProps, createApp } from "./dataSourceNodes";

export const DataSourceNode_Blank = (props: DataSourceNodeProps) => {
  const { setDataSource, setError } = props;

  const load = async () => {
    try {
      const dialect = await DataSourceValue.createDialect_blank();
      const db = DataSourceValue.createKysely(dialect);
      await Database.prepareSchema(db);

      const app = createApp(db);
      setDataSource({ _tag: "sandbox", db, app });
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
