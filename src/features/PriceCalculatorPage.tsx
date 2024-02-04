import { useState } from "react";
import { Button } from "semantic-ui-react";

export const PriceCalculatorPage = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>price calculator</h1>

      <div>
        <Button onClick={() => setCount((count) => count + 1)} type="button">
          count is {count}
        </Button>
      </div>
    </>
  );
};
