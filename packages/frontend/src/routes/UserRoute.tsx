import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { supabase } from "../constants";
import { DataSourceContext } from "../contexts/DataSourceContext";

export const UserRouter = () => (
  <Routes>
    <Route index element={<UserRootPage />} />
  </Routes>
);

const UserRootPage = () => {
  const dataSource = useContext(DataSourceContext);
  const session = dataSource._tag === "supabase" ? dataSource.session : null;

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  return (
    <>
      <h1>user</h1>

      <h2>supabase</h2>
      <Button onClick={signOut}>Sign Out</Button>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </>
  );
};
