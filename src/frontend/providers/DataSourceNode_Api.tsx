import { Button, TextInput } from "@mantine/core";
import type React from "react";
import { useState } from "react";
import type { DataSourceNodeProps } from "./dataSourceNodes.js";

export const DataSourceNode_Api = (props: DataSourceNodeProps) => {
  const { setDataSource, setError, session } = props;

  const [endpoint, setEndpoint] = useState("http://127.0.0.1:3000");

  const handleSubmit = async (e: React.FormEvent) => {
    setDataSource({
      _tag: "api",
      endpoint,
      session,
    });

    // TODO: 더 멀쩡하게?
    e.preventDefault();
    return false;
  };

  return (
    <>
      <h3>api server</h3>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          onChange={(e) => setEndpoint(e.target.value)}
          value={endpoint}
        />

        <Button type="submit" disabled={endpoint.length === 0}>
          connect
        </Button>
      </form>
    </>
  );
};
