import { dataSheet } from "@yuuka/backend";
import { useState } from "react";
import { Button, Form, FormField } from "semantic-ui-react";

export const ArithmeticCalculatorPage = () => {
  const [lhs, setLhs] = useState(0);
  const [rhs, setRhs] = useState(0);
  const [result, setResult] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const request = async () => {
    const spec = dataSheet.add;
    const { endpoint } = spec;

    type Input = (typeof spec.inout)["_in"];
    type Output = (typeof spec.inout)["_out"];

    const input: Input = {
      a: lhs,
      b: rhs,
    };

    const qs = new URLSearchParams();
    for (const entry of Object.entries(input)) {
      qs.append(entry[0], entry[1].toString());
    }

    // TODO: 개발/운영 나누기
    const host = "http://localhost:3000";
    const url = `${host}${endpoint.path}?${qs}`;

    try {
      const res = await fetch(url, {
        method: endpoint.method,
      });
      const json = await res.json();
      const output = json as Output;
      setResult(output.sum);
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        console.error(e);
      }
    }
  };

  return (
    <>
      <h1>arithmetic</h1>

      <Form>
        <FormField>
          <input
            type="number"
            value={lhs}
            onChange={(e) => setLhs(Number(e.target.value))}
          />
        </FormField>

        <FormField>
          <input
            type="number"
            value={rhs}
            onChange={(e) => setRhs(Number(e.target.value))}
          />
        </FormField>

        <Button type="button" onClick={async () => request()}>
          add
        </Button>

        <p>result: {result}</p>

        {error ? (
          <div>
            <h1>error: {error.name}</h1>
            <p>{error.message}</p>
          </div>
        ) : null}
      </Form>
    </>
  );
};
