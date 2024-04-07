import { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { DataSourceContext } from "../../../providers/DataSourceContext.js";

export const BookRootPage = () => {
  const dataSource = useContext(DataSourceContext);

  const sqlite = dataSource._tag !== "api" ? dataSource.sqlite : null;
  const db = dataSource._tag !== "api" ? dataSource.db : null;

  if (!sqlite) return <p>no sqlite</p>;
  if (!db) return <p>no db</p>;

  const save = async () => {
    // TODO: await LocalStore.save(sqlite);
    console.log("TODO: save");
  };

  return (
    <>
      <h1>book</h1>
      <Button onClick={save}>save</Button>

      <ul>
        <li>
          <Link to="/book/tables">tables</Link>
        </li>
        <li>
          <Link to="/book/query">query</Link>
        </li>
      </ul>
    </>
  );
};
