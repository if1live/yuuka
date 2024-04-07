import { Link, Outlet, useLocation } from "react-router-dom";
import { Container, Menu, MenuMenu } from "semantic-ui-react";

export const Root = () => {
  const loc = useLocation();

  const checkActive = (prefix: string) => loc.pathname.startsWith(prefix);

  return (
    <>
      <Menu fiexed="top" size="small">
        <Container>
          <Menu.Item as={Link} to="/" header>
            yuuka
          </Menu.Item>

          <Menu.Item as={Link} to="/journal" active={checkActive("/journal")}>
            journal
          </Menu.Item>

          <Menu.Item as={Link} to="/ledger" active={checkActive("/ledger")}>
            ledger
          </Menu.Item>

          <Menu.Item as={Link} to="/book" active={checkActive("/book")}>
            book
          </Menu.Item>
        </Container>
      </Menu>

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
