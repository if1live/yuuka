import { Anchor, Container } from "@mantine/core";
import { Link, Outlet, useLocation } from "react-router-dom";

export const Root = () => {
  const loc = useLocation();

  const checkActive = (prefix: string) => loc.pathname.startsWith(prefix);

  return (
    <>
      <Container>
        <Anchor component={Link} to="/">
          yuuka
        </Anchor>
        {" | "}
        <Anchor component={Link} to="/ledger">
          ledger
        </Anchor>
        {" | "}
        <Anchor component={Link} to="/user">
          user
        </Anchor>
      </Container>

      <div
        style={{
          // 페이지 아래에 공백을 넣고 싶다.
          paddingBottom: "120px",
        }}
      >
        <Container fluid>
          <Outlet />
        </Container>
      </div>
    </>
  );
};
