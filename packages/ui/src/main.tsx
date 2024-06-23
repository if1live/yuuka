import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.js";

// TODO: React.StrictMode + development mode에서는 렌더링 2번 된다. 문제 있으면 strict mode 끄기
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
