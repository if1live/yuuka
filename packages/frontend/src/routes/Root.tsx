import { useContext } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Container, Menu } from "semantic-ui-react";
import { AuthContext } from "../contexts/AuthContext";

export const Root = () => {
  const loc = useLocation();
  const auth = useContext(AuthContext);

  const checkActive = (prefix: string) => loc.pathname.startsWith(prefix);

  return (
    <>
      <Container>
        <Menu fiexed="top">
          <Menu.Item as={Link} to="/" header>
            yuuka
          </Menu.Item>

          <Menu.Item as={Link} to="/journal" active={checkActive("/journal")}>
            journal
          </Menu.Item>

          <Menu.Item as={Link} to="/ledger" active={checkActive("/ledger")}>
            ledger
          </Menu.Item>

          <Menu.Item position="right">UserID: {auth.userId}</Menu.Item>
        </Menu>
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
