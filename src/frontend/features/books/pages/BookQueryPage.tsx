import { useContext } from "react";
import { DataSourceContext } from "../../../providers/DataSourceContext.js";
import { QueryExecuteView } from "../components/QueryExecuteView.js";

export const BookQueryPage = () => {
  const dataSource = useContext(DataSourceContext);
  const sqlite = dataSource._tag !== "api" ? dataSource.sqlite : null;
  const db = dataSource._tag !== "api" ? dataSource.db : null;

  if (!sqlite) return <p>no sqlite</p>;
  if (!db) return <p>no db</p>;

  return <QueryExecuteView db={db} sqlite={sqlite} />;
};
