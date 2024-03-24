import { useContext } from "react";
import { Button } from "semantic-ui-react";
import { supabase } from "../../../constants";
import { DataSourceContext } from "../../../contexts/DataSourceContext";

export const UserRootPage = () => {
  const dataSource = useContext(DataSourceContext);
  const session = dataSource._tag === "supabase" ? dataSource.session : null;

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  return (
    <>
      <h1>user</h1>
      <h2>data source: {dataSource._tag}</h2>

      {session ? (
        <>
          <h2>supabase</h2>
          <Button onClick={signOut}>Sign Out</Button>
        </>
      ) : null}
    </>
  );
};
