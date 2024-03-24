import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import type { Session } from "@supabase/supabase-js";
import type { KyselyDB } from "@yuuka/db";
import { type PropsWithChildren, useEffect, useState } from "react";
import { Button, ButtonGroup, ButtonOr } from "semantic-ui-react";
import type { Database } from "sql.js";
import { supabase } from "../constants";
import { DataSourceValue } from "../contexts/DataSourceContext";
import { LocalStore } from "../stores/LocalStore";
import { RemoteStore } from "../stores/RemoteStore";
import { type DataSourceNodeProps, createApp } from "./dataSourceNodes";

type LoadFn = (session: Session) => Promise<{ db: KyselyDB; sqlite: Database }>;

const load_remote: LoadFn = async (session: Session) => {
  const sqlite = await RemoteStore.download(session.user.id);
  const dialect = DataSourceValue.createDialect(sqlite);
  const db = DataSourceValue.createKysely(dialect);
  return { db, sqlite };
};

const load_browser: LoadFn = async (session: Session) => {
  const sqlite = await LocalStore.load();
  const dialect = DataSourceValue.createDialect(sqlite);
  const db = DataSourceValue.createKysely(dialect);
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
    <Button type="button" onClick={handleClick} loading={loading}>
      {props.children}
    </Button>
  );
};

export const DataSourceNode_Supabase = (props: DataSourceNodeProps) => {
  const [session, setSession] = useState<Session | null>(null);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <>
        <h3>supabase</h3>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      </>
    );
  }

  return (
    <>
      <h3>supabase</h3>
      <ButtonGroup>
        <LoadButton {...props} session={session} load={load_remote}>
          remote
        </LoadButton>
        <ButtonOr />
        <LoadButton {...props} session={session} load={load_browser}>
          browser
        </LoadButton>
        <ButtonOr />
        <Button type="button" onClick={signOut} negative>
          sign out
        </Button>
      </ButtonGroup>
    </>
  );
};
