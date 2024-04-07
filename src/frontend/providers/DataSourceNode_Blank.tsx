import { Button } from "semantic-ui-react";
import { KyselyHelper } from "../../rdbms/index.js";
import { fromBuffer, prepareSqlJs } from "../../rdbms/loader.js";
import { type DataSourceNodeProps, createApp } from "./dataSourceNodes.js";

export const DataSourceNode_Blank = (props: DataSourceNodeProps) => {
  const { setDataSource, setError } = props;

  const load = async () => {
    try {
      const SQL = await prepareSqlJs();
      const buffer = Uint8Array.from([]);
      const { sqlite, db } = fromBuffer(SQL, buffer, {});
      await KyselyHelper.createSchema(db);

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
