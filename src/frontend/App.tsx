import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Container, Image } from "semantic-ui-react";
import { supabase } from "./constants.js";
import { DataSourceProvider } from "./providers/DataSourceProvider.js";
import { MasterDataProvider } from "./providers/MasterDataProvider.js";
import { BookRouter } from "./routes/BookRoute.js";
import { JournalRouter } from "./routes/JournalRoute.js";
import { LedgerRouter } from "./routes/LedgerRoute.js";
import { Root } from "./routes/Root.js";

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="/journal/*" element={<JournalRouter />} />
      <Route path="/ledger/*" element={<LedgerRouter />} />
      <Route path="/book/*" element={<BookRouter />} />
    </Route>,
  ),
  {
    // hash router에서는 없어야 제대로 작동한다.
    // browser router 쓸때는 basename 붙어야 작동한다.
    // github pages 기준으로는 어차피 정적 파일밖에 안되니까 hash router로 선택
    // index.html을 404.html로 복사하는 편법을 쓰면 browser router 쓸 수 있긴하더라
    // basename: "/yuuka",
  },
);

// 어차피 혼자 쓸건데 항상 인증된걸 기준으로 하는게 나을듯
export const App = () => {
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
      <Container text>
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
    <DataSourceProvider session={session}>
      <MasterDataProvider>
        <RouterProvider router={router} />
      </MasterDataProvider>
    </DataSourceProvider>
  );
};
