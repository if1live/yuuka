import { Button } from "@mantine/core";
import type { Session } from "@supabase/supabase-js";
import { type PropsWithChildren, useEffect, useState } from "react";
import type { Database } from "sql.js";
import type { MyKysely } from "../../index.js";
import { fromSqlite } from "../../rdbms/loader.js";
import { LocalStore } from "./LocalStore.js";
import { RemoteStore } from "./RemoteStore.js";
import { type DataSourceNodeProps, createApp } from "./dataSourceNodes.js";

type LoadFn = (session: Session) => Promise<{ db: MyKysely; sqlite: Database }>;

const load_remote: LoadFn = async (session: Session) => {
  const sqlite = await RemoteStore.download(session.user.id);
  const db = fromSqlite(sqlite, {});

  // remote 가져온걸 브라우저에 덮어쓰기
  await LocalStore.save(sqlite);
  return { db, sqlite };
};

const load_browser: LoadFn = async (session: Session) => {
  const sqlite = await LocalStore.load();
  const db = fromSqlite(sqlite, {});
  return { db, sqlite };
};

const LoadButton = (
  props: PropsWithChildren &
    DataSourceNodeProps & {
      session: Session;
      load: LoadFn;
    },
) => {
  const { setDataSource, setError, session } = props;
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const { db, sqlite } = await props.load(session);

      setDataSource({
        _tag: "supabase",
        sqlite,
        db,
        app: createApp(db),
        session,
      });
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} loading={loading}>
      {props.children}
    </Button>
  );
};

export const DataSourceNode_Supabase = (props: DataSourceNodeProps) => {
  const deleteLocal = async () => {
    await LocalStore.del();
  };

  return (
    <>
      <h3>supabase</h3>
      <Button.Group>
        <LoadButton {...props} load={load_remote}>
          remote
        </LoadButton>
        <LoadButton {...props} load={load_browser}>
          browser
        </LoadButton>
        <Button type="button" onClick={deleteLocal} color="red">
          delete
        </Button>
      </Button.Group>
    </>
  );
};
