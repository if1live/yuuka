import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import type { Session } from "@supabase/supabase-js";
import { type PropsWithChildren, useContext, useEffect, useState } from "react";
import { supabase } from "../constants";
import { AuthContext, type AuthState } from "../contexts/AuthContext";
import { DataSourceContext } from "../contexts/DataSourceContext";

export const AuthenticateProvider = (props: PropsWithChildren) => {
  const dataSource = useContext(DataSourceContext);

  return dataSource._tag === "supabase" ? (
    <AuthenticateProvider_Supabase {...props} />
  ) : (
    <>{props.children}</>
  );
};

const AuthenticateProvider_Supabase = (props: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);

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
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
      />
    );
  }

  const store: AuthState = {
    session,
  };

  return (
    <AuthContext.Provider value={store}>{props.children}</AuthContext.Provider>
  );
};
