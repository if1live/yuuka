import { Container } from "@mantine/core";
import { SupabaseSignOutButton } from "../components/SupabaseSignOutButton.js";

export const UserRootPage = () => {
  return (
    <Container>
      <h1>user root</h1>

      <SupabaseSignOutButton />
    </Container>
  );
};
