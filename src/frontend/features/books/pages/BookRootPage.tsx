import { useContext } from "react";
import { Link } from "react-router-dom";
import { ButtonGroup } from "semantic-ui-react";
import { DataSourceContext } from "../../../providers/DataSourceContext.js";
import { SupabaseSignOutButton } from "../components/SupabaseSignOutButton.js";
import { SupabaseUploadForm } from "../components/SupabaseUploadForm.js";

export const BookRootPage = () => {
  const dataSource = useContext(DataSourceContext);

  const sqlite = dataSource._tag !== "api" ? dataSource.sqlite : null;
  const db = dataSource._tag !== "api" ? dataSource.db : null;

  if (!sqlite) return <p>no sqlite</p>;
  if (!db) return <p>no db</p>;

  return (
    <>
      <h1>book</h1>

      <h2>supabase</h2>
      <SupabaseUploadForm />

      <ButtonGroup>
        <SupabaseSignOutButton />
      </ButtonGroup>

      <h3>actions</h3>
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
