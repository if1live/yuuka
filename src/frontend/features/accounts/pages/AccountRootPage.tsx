import { Anchor, Container } from "@mantine/core";
import { Link } from "react-router-dom";
import { DateOnly } from "../../../../core/DateOnly.js";

export const AccountRootPage = () => {
  const now = new Date();
  const date = DateOnly.fromDate(now);

  const url_snapshot = `/account/snapshot/${date}`;

  return (
    <Container>
      <h1>account</h1>

      <Anchor component={Link} to={url_snapshot}>
        account snapshot
      </Anchor>
    </Container>
  );
};
