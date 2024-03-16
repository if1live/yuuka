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
import { Button, Container, Form, FormField } from "semantic-ui-react";
import { SWRConfig } from "swr";
import { TOKEN_SECRET } from "../constants";
import {
  DataSourceContext,
  DataSourceValue,
} from "../contexts/DataSourceProvider";
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
}

const DataSourceNode_Blank = (props: Props) => {
  const { setDataSource } = props;

  const load = async () => {
    const dialect = await DataSourceValue.createDialect_blank();
    const db = DataSourceValue.createKysely(dialect);
    await Database.prepareSchema(db);
    setDataSource({ _tag: "sandbox", db });
  };

  return (
    <>
      <h3>blank project</h3>
      <p>새로운 프로젝트 시작하기</p>
      <Button type="button" onClick={load}>
        blank
      </Button>
    </>
  );
};

const DataSourceNode_DragAndDrop = (props: Props) => {
  const { setDataSource } = props;

  const load = async () => {
    // TODO: 입력으로 받을 파일은 무엇을 기반으로 결정하지?
    const url = "/yuuka/sqlite.db";
    const resp = await fetch(url);
    const arrayBuffer = await resp.arrayBuffer();
    const dialect =
      await DataSourceValue.createDialect_arrayBuffer(arrayBuffer);
    const db = DataSourceValue.createKysely(dialect);
    setDataSource({ _tag: "sandbox", db });
  };

  return (
    <>
      <h3>upload</h3>
      <p>sqlite 파일 업로드</p>
      <Button type="button" onClick={load}>
        upload
      </Button>
    </>
  );
};

const DataSourceNode_Authenticate = (props: Props) => {
  const { setDataSource } = props;

  const [username, setUsername] = useState<string>("");

  const load = async () => {
    // 껍데기만 만들고 나머지 정보는 나중에 채운다
    const dialect = await DataSourceValue.createDialect_blank();
    const db = DataSourceValue.createKysely(dialect);
    await Database.prepareSchema(db);
    setDataSource({ _tag: "network", db, username });
  };

  return (
    <>
      <h3>sign in</h3>
      <p>TODO: 로그인해서 기존 데이터 이어가기</p>
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

  if (value === null) {
    return (
      <Container text>
        <h1>yuuka</h1>

        <DataSourceNode_Blank setDataSource={setDataSource} />
        <DataSourceNode_DragAndDrop setDataSource={setDataSource} />
        <DataSourceNode_Authenticate setDataSource={setDataSource} />
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
