import { Link, Outlet, useLocation } from "react-router-dom";
import { Container, Menu } from "semantic-ui-react";

function App() {
  const loc = useLocation();

  const prefix_cost = "/cost";
  const prefix_tvm = "/tvm";
  const prefix_arithmetic = "/arithmetic";
  const isRootPath = loc.pathname === "/";

  return (
    <>
      <Menu secondary pointing>
        <Menu.Item
          as={Link}
          active={loc.pathname.startsWith(prefix_arithmetic)}
          to={prefix_arithmetic}
        >
          산술
        </Menu.Item>

        <Menu.Item
          as={Link}
          active={loc.pathname.startsWith(prefix_cost)}
          to={prefix_cost}
        >
          가성비
        </Menu.Item>

        <Menu.Item
          as={Link}
          active={loc.pathname.startsWith(prefix_tvm)}
          to={prefix_tvm}
        >
          TVM
        </Menu.Item>
      </Menu>

      <Container text>
        <Outlet />
      </Container>
    </>
  );
}

export default App;
