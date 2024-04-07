import { Button } from "semantic-ui-react";
import { supabase } from "../../../constants.js";

export const SupabaseSignOutButton = () => {
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  return (
    <Button onClick={signOut} negative>
      sign out
    </Button>
  );
};
