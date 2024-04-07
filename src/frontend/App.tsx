import * as React from "react";
import { useState } from "react";
import { Image } from "semantic-ui-react";

export const App = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <Image src="/yuuka/yuuka-plain.jpg" />

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
    </>
  );
};