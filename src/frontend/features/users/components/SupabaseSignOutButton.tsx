import { Button } from "@mantine/core";
import { supabase } from "../../../constants.js";

export const SupabaseSignOutButton = () => {
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  return (
    <Button onClick={signOut} color="red">
      sign out
    </Button>
  );
};
