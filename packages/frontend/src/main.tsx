import React from "react";
import ReactDOM from "react-dom/client";
import "semantic-ui-css/semantic.min.css";
import { App } from "./App";
import "./index.css";

// TODO: React.StrictMode + development mode에서는 렌더링 2번 되는데 이거 피하고 싶다
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>,

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
