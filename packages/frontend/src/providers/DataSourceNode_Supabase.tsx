import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import type { Session } from "@supabase/supabase-js";
import { Database } from "@yuuka/db";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, ButtonOr } from "semantic-ui-react";
import { supabase } from "../constants";
import { DataSourceValue } from "../contexts/DataSourceContext";
import { type DataSourceNodeProps, createApp } from "./dataSourceNodes";
import { downloadBook } from "./networks";

export const DataSourceNode_Supabase = (props: DataSourceNodeProps) => {
  const { setDataSource, setError } = props;

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

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

  const load_remote = async (session: Session) => {
    try {
      setLoading(true);
      const arraybuffer = await downloadBook(session.user.id);
      const { dialect, sqlite } =
        await DataSourceValue.createDialect_arrayBuffer(arraybuffer);
      const db = DataSourceValue.createKysely(dialect);
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

  // TODO: 브라우저에 저장된 데이터 그대로 쓰기
  const load_browser = async (session: Session) => {
    try {
      const { dialect, sqlite } = await DataSourceValue.createDialect_blank();
      const db = DataSourceValue.createKysely(dialect);
      await Database.prepareSchema(db);
      setDataSource({
        _tag: "supabase",
        sqlite,
        db,
        app: createApp(db),
        session,
      });
    } catch (e) {
      setError(e as Error);
    }
  };

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
        <Button
          type="button"
          onClick={() => load_remote(session)}
          loading={loading}
        >
          remote
        </Button>
        <ButtonOr />
        <Button type="button" onClick={() => load_browser(session)}>
          browser
        </Button>
        <ButtonOr />
        <Button type="button" onClick={signOut} negative>
          sign out
        </Button>
      </ButtonGroup>
    </>
  );
};
