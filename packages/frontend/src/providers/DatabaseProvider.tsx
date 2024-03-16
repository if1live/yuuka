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
import { DatabaseContext, DatabaseValue } from "../contexts/DatabaseContext";
import { fetcherWithApp } from "../fetchers";

const createApp = (db: Kysely<Database>) => {
  const app = new Hono();
  app.use("/auth/*", jwt({ secret: TOKEN_SECRET }));
  app.route(ResourceController.path, ResourceController.createApp(db));
  app.route(JournalController.path, JournalController.createApp(db));
  app.route(LedgerController.path, LedgerController.createApp(db));
  return app;
};

export const DatabaseProvider = (props: PropsWithChildren) => {
  const [value, setValue] = useState<DatabaseValue | null>(null);
  const [username, setUsername] = useState<string>("");

  const load_blank = async () => {
    const dialect = await DatabaseValue.createDialect_blank();
    const db = DatabaseValue.createKysely(dialect);
    await Database.prepareSchema(db);
    setValue({
      db,
      mode: "sandbox",
      username: "",
      app: createApp(db),
    });
  };

  const load_upload = async () => {
    // TODO: 입력으로 받을 파일은 무엇을 기반으로 결정하지?
    const url = "/yuuka/sqlite.db";
    const resp = await fetch(url);
    const arrayBuffer = await resp.arrayBuffer();
    const dialect = await DatabaseValue.createDialect_arrayBuffer(arrayBuffer);
    const db = DatabaseValue.createKysely(dialect);
    setValue({
      db,
      mode: "sandbox",
      username: "",
      app: createApp(db),
    });
  };

  const load_authenticate = async () => {
    // 껍데기만 만들고 나머지 정보는 나중에 채운다
    const dialect = await DatabaseValue.createDialect_blank();
    const db = DatabaseValue.createKysely(dialect);
    await Database.prepareSchema(db);
    setValue({
      db,
      mode: "network",
      username,
      app: createApp(db),
    });
  };

  if (value === null) {
    return (
      <Container text>
        <h1>yuuka</h1>
        <h2>select data source</h2>

        <h3>blank project</h3>
        <p>새로운 프로젝트 시작하기</p>
        <Button type="button" onClick={load_blank}>
          blank
        </Button>

        <h3>upload</h3>
        <p>sqlite 파일 업로드</p>
        <Button type="button" onClick={load_upload}>
          upload
        </Button>

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
            <Button
              type="submit"
              onClick={load_authenticate}
              disabled={username.length === 0}
            >
              sign in
            </Button>
          </FormField>
        </Form>
      </Container>
    );
  }

  const { app } = value;

  return (
    <DatabaseContext.Provider value={value}>
      <SWRConfig value={{ fetcher: fetcherWithApp(app) }}>
        {props.children}
      </SWRConfig>
    </DatabaseContext.Provider>
  );
};
