import { useState } from "react";
import { Button, Form, FormField } from "semantic-ui-react";
import type { DataSourceNodeProps } from "./dataSourceNodes";

export const DataSourceNode_Server = (props: DataSourceNodeProps) => {
  const { setDataSource, setError } = props;

  const [endpoint, setEndpoint] = useState("http://127.0.0.1:3000");

  const handleSubmit = async () => {
    setDataSource({ _tag: "server", endpoint });
  };

  return (
    <>
      <h3>api server</h3>
      <Form onSubmit={handleSubmit}>
        <FormField>
          <input
            type="text"
            onChange={(e) => setEndpoint(e.target.value)}
            value={endpoint}
          />
        </FormField>

        <FormField>
          <Button type="submit" disabled={endpoint.length === 0}>
            connect
          </Button>
        </FormField>
      </Form>
    </>
  );
};
