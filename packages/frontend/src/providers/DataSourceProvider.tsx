import {
  JournalController,
  LedgerController,
  ResourceController,
} from "@yuuka/core";
import { Database } from "@yuuka/db";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import type { Kysely } from "kysely";
import { type PropsWithChildren, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Image } from "semantic-ui-react";
import { Button, Container, Form, FormField } from "semantic-ui-react";
import { SWRConfig } from "swr";
import { TOKEN_SECRET } from "../constants";
import {
  DataSourceContext,
  DataSourceValue,
} from "../contexts/DataSourceContext";
import { fetcherWithApp } from "../fetchers";

const createApp = (db: Kysely<Database>) => {
  const app = new Hono();
  app.use("/auth/*", jwt({ secret: TOKEN_SECRET }));
  app.route(ResourceController.path, ResourceController.createApp(db));
  app.route(JournalController.path, JournalController.createApp(db));
  app.route(LedgerController.path, LedgerController.createApp(db));
  return app;
};

type DataSource_Sandbox = {
  _tag: "sandbox";
  db: Kysely<Database>;
};

type DataSource_Network = {
  _tag: "network";
  db: Kysely<Database>;
  username: string;
};

type DataSource = DataSource_Sandbox | DataSource_Network;

interface Props {
  setDataSource: (source: DataSource) => void;
  setError: (e: Error) => void;
}

const DataSourceNode_Blank = (props: Props) => {
  const { setDataSource, setError } = props;

  const load = async () => {
    try {
      const dialect = await DataSourceValue.createDialect_blank();
      const db = DataSourceValue.createKysely(dialect);
      await Database.prepareSchema(db);
      setDataSource({ _tag: "sandbox", db });
    } catch (e) {
      setError(e as Error);
    }
  };

  return (
    <>
      <h3>blank project</h3>
      <Button type="button" onClick={load}>
        start
      </Button>
    </>
  );
};

const DataSourceNode_DragAndDrop = (props: Props) => {
  const fileTypes = ["sqlite", "db"];

  const { setDataSource, setError } = props;

  const [file, setFile] = useState<File | null>(null);

  const handleChange = async (file: File) => {
    setFile(file);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const dialect =
        await DataSourceValue.createDialect_arrayBuffer(arrayBuffer);
      const db = DataSourceValue.createKysely(dialect);
      setDataSource({ _tag: "sandbox", db });
    } catch (e) {
      setError(e as Error);
    }
  };

  return (
    <>
      <h3>drag and drop</h3>
      <FileUploader
        multiple={false}
        handleChange={handleChange}
        name="file"
        types={fileTypes}
      />
      <p>{file ? `File name: ${file.name}` : "no files uploaded yet"}</p>
    </>
  );
};

const DataSourceNode_Demo = (props: Props) => {
  const { setDataSource, setError } = props;

  // 예제 파일 뭐로 만들지?
  const url = "/yuuka/sqlite.db";

  const load = async () => {
    try {
      const resp = await fetch(url);
      const arrayBuffer = await resp.arrayBuffer();
      const dialect =
        await DataSourceValue.createDialect_arrayBuffer(arrayBuffer);
      const db = DataSourceValue.createKysely(dialect);
      setDataSource({ _tag: "sandbox", db });
    } catch (e) {
      setError(e as Error);
    }
  };

  return (
    <>
      <h3>demo project</h3>
      <Button type="button" onClick={load}>
        demo
      </Button>
    </>
  );
};

const DataSourceNode_Authenticate = (props: Props) => {
  const { setDataSource, setError } = props;

  const [username, setUsername] = useState<string>("");

  const load = async () => {
    try {
      // 껍데기만 만들고 나머지 정보는 나중에 채운다
      const dialect = await DataSourceValue.createDialect_blank();
      const db = DataSourceValue.createKysely(dialect);
      await Database.prepareSchema(db);
      setDataSource({ _tag: "network", db, username });
    } catch (e) {
      setError(e as Error);
    }
  };

  return (
    <>
      <h3>sign in</h3>
      <Form>
        <FormField>
          <label>username</label>
          <input type="text" onChange={(e) => setUsername(e.target.value)} />
        </FormField>

        <FormField>
          <label>password</label>
          <input type="password" />
        </FormField>

        <FormField>
          <Button type="submit" onClick={load} disabled={username.length === 0}>
            sign in
          </Button>
        </FormField>
      </Form>
    </>
  );
};

export const DataSourceProvider = (props: PropsWithChildren) => {
  const [value, setValue] = useState<DataSourceValue | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const setDataSource = (source: DataSource) => {
    const db = source.db;
    const app = createApp(db);
    const skel = { app, db };
    switch (source._tag) {
      case "sandbox": {
        setValue({ mode: "sandbox", username: "", ...skel });
        break;
      }
      case "network": {
        setValue({ mode: "network", username: source.username, ...skel });
        break;
      }
    }
  };

  if (error) {
    return (
      <Container text>
        <h1>yuuka</h1>

        <p>error: {error.name}</p>
        <p>{error.message}</p>
      </Container>
    );
  }

  if (value === null) {
    return (
      <Container text>
        <h1>project: yuuka</h1>

        <Image src="/yuuka/yuuka-plain.jpg" />

        <DataSourceNode_Authenticate
          setDataSource={setDataSource}
          setError={setError}
        />

        <DataSourceNode_DragAndDrop
          setDataSource={setDataSource}
          setError={setError}
        />

        <DataSourceNode_Demo
          setDataSource={setDataSource}
          setError={setError}
        />

        <DataSourceNode_Blank
          setDataSource={setDataSource}
          setError={setError}
        />

        <hr />

        <footer>
          <p>
            <a href="https://github.com/if1live/yuuka">github</a>
          </p>
        </footer>
      </Container>
    );
  }

  const { app } = value;

  return (
    <DataSourceContext.Provider value={value}>
      <SWRConfig value={{ fetcher: fetcherWithApp(app) }}>
        {props.children}
      </SWRConfig>
    </DataSourceContext.Provider>
  );
};
