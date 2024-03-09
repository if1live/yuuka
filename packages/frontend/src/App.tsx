import { useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";
import reactLogo from "./assets/react.svg";
import { SamplePage } from "./features/SamplePage";

function App() {
  const [count, setCount] = useState(0);

  /*
  /journal/list/2024-03
  /journal/entry/1 <- TODO:
  /ledger/123 <- 모아보기 3자리
  /ledger/123123 <- 상세보기 6자리
  */
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button type="button" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <SamplePage />
    </>
  );
}

export default App;
