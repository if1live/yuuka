import { Anchor, Container } from "@mantine/core";
import { Link } from "react-router-dom";

export const JournalRootPage = () => {
  return (
    <Container>
      <h1>journal root</h1>

      <Anchor component={Link} to="/journal/action/create">
        create
      </Anchor>
    </Container>
  );
};
