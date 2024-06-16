import { Container, Image, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Router } from "./Router.js";
import { supabase } from "./constants.js";
import { MasterDataProvider } from "./providers/MasterDataProvider.js";

// 어차피 혼자 쓸건데 항상 인증된걸 기준으로 하는게 나을듯
const ContentApp = () => {
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
      <Container>
        <h1>project: yuuka</h1>
        <Image src="/yuuka/yuuka-plain.jpg" />

        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      </Container>
    );
  }

  return (
    <MasterDataProvider>
      <Router />
    </MasterDataProvider>
  );
};

export const App = () => {
  return (
    <MantineProvider>
      <ContentApp />
    </MantineProvider>
  );
};
