import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import App from "./App.tsx";
import { PriceCalculatorPage } from "./features/PriceCalculatorPage.tsx";
import { TimeValueOfMoneyCalculatorPage } from "./features/TimeValueOfMoneyCalculatorPage.tsx";
import "./index.css";

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/cost" element={<PriceCalculatorPage />} />
      <Route path="/tvm" element={<TimeValueOfMoneyCalculatorPage />} />
    </Route>,
  ),
);

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
