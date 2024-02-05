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
import { ArithmeticCalculatorPage } from "./features/ArithmeticCalculatorPage.tsx";
import { PriceCalculatorPage } from "./features/PriceCalculatorPage.tsx";
import { TimeValueOfMoneyCalculatorPage } from "./features/TimeValueOfMoneyCalculatorPage.tsx";
import "./index.css";

/*
TODO: vite pwa로 날로 먹으면서 fetch 갈아끼우는 방법 어디 없나?
import { registerSW } from "virtual:pwa-register";
const updateSW = registerSW({
  onNeedRefresh() {
    console.log("onNeedRefresh");

    // https://adueck.github.io/blog/caching-everything-for-totally-offline-pwa-vite-react/
    if (confirm("New content available. Reload?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("onOfflineReady");
  },
});
*/

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<ArithmeticCalculatorPage />} />
      <Route path="/arithmetic" element={<ArithmeticCalculatorPage />} />
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
