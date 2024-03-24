import { useState } from "react";
import { Button, Form, FormField } from "semantic-ui-react";
import { DataSourceValue } from "../contexts/DataSourceContext";
import { LocalStore } from "../stores/LocalStore";
import { type DataSourceNodeProps, createApp } from "./dataSourceNodes";

export const DataSourceNode_RemoteFile = (props: DataSourceNodeProps) => {
  const { setDataSource, setError } = props;

  const [url, setUrl] = useState("/yuuka/sqlite.db");

  const handleSubmit = async () => {
    try {
      const resp = await fetch(url);
      const arrayBuffer = await resp.arrayBuffer();
      const sqlite = await LocalStore.initial(arrayBuffer);
      const dialect = DataSourceValue.createDialect(sqlite);
      const db = DataSourceValue.createKysely(dialect);
      const app = createApp(db);
      setDataSource({ _tag: "sandbox", sqlite, db, app });
    } catch (e) {
      setError(e as Error);
    }
  };

  return (
    <>
      <h3>remote file</h3>
      <Form onSubmit={handleSubmit}>
        <FormField>
          <input
            type="url"
            onChange={(e) => setUrl(e.target.value)}
            value={url}
          />
        </FormField>

        <FormField>
          <Button type="submit" disabled={url.length === 0}>
            fetch
          </Button>
        </FormField>
      </Form>
    </>
  );
};
