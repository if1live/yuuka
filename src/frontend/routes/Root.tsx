import { Container } from "@mantine/core";
import { Link, Outlet, useLocation } from "react-router-dom";

export const Root = () => {
  const loc = useLocation();

  const checkActive = (prefix: string) => loc.pathname.startsWith(prefix);

  return (
    <>
      <Container>
        <Link to="/">yuuka</Link>
        <Link to="/journal">journal</Link>
        <Link to="/ledger">ledger</Link>
        <Link to="/balance">balance</Link>
        <Link to="/book">book</Link>
      </Container>

      <div
        style={{
          paddingTop: "20px",
          paddingBottom: "60px",
        }}
      >
        <Container>
          <Outlet />
        </Container>
      </div>
    </>
  );
};
