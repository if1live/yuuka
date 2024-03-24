import { Link, Outlet, useLocation } from "react-router-dom";
import { Container, Menu, MenuMenu } from "semantic-ui-react";
import { SupabaseUploadButton } from "../features/users/components/SupabaseUploadButton";

export const Root = () => {
  const loc = useLocation();

  const checkActive = (prefix: string) => loc.pathname.startsWith(prefix);

  return (
    <>
      <Container>
        <Menu fiexed="top" size="small">
          <Menu.Item as={Link} to="/" header>
            yuuka
          </Menu.Item>

          <Menu.Item as={Link} to="/journal" active={checkActive("/journal")}>
            journal
          </Menu.Item>

          <Menu.Item as={Link} to="/ledger" active={checkActive("/ledger")}>
            ledger
          </Menu.Item>

          <MenuMenu position="right">
            <Menu.Item>
              <SupabaseUploadButton />
            </Menu.Item>

            <Menu.Item as={Link} to="/user" active={checkActive("/user")}>
              user
            </Menu.Item>
          </MenuMenu>
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
