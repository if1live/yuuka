import ReactDOM from "react-dom/client";
import { App } from "./App.js";

// TODO: React.StrictMode + development mode에서는 렌더링 2번 되는데 이거 피하고 싶다
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>,
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />,
);
