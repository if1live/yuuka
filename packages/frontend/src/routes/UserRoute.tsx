import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { supabase } from "../constants";
import { AuthContext } from "../contexts/AuthContext";

export const UserRouter = () => (
  <Routes>
    <Route index element={<UserRootPage />} />
  </Routes>
);

const UserRootPage = () => {
  const { session } = useContext(AuthContext);
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
