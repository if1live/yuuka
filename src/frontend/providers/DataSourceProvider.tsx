import { Container, Image } from "@mantine/core";
import type { Session } from "@supabase/supabase-js";
import { type PropsWithChildren, useState } from "react";
import { SWRConfig } from "swr";
import { SupabaseSignOutButton } from "../features/books/components/SupabaseSignOutButton.js";
import { fetcherWithApp, fetcherWithHttp } from "../fetchers/index.js";
import {
  DataSourceContext,
  type DataSourceValue,
} from "./DataSourceContext.js";
import { DataSourceNode_Api } from "./DataSourceNode_Api.js";
import { DataSourceNode_Blank } from "./DataSourceNode_Blank.js";
import { DataSourceNode_DragAndDrop } from "./DataSourceNode_DragAndDrop.js";
import { DataSourceNode_Supabase } from "./DataSourceNode_Supabase.js";

export const DataSourceProvider = (
  props: PropsWithChildren & {
    session: Session;
  },
) => {
  const { session } = props;
  const [dataSource, setDataSource] = useState<DataSourceValue | null>(null);
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    console.error(error);
    return (
      <Container>
        <h1>yuuka</h1>

        <p>error: {error.name}</p>
        <p>{error.message}</p>
        <p>{error.stack}</p>
      </Container>
    );
  }

  if (dataSource === null) {
    const childProps = {
      setDataSource,
      setError,
      session,
    } as const;

    return (
      <Container>
        <h1>project: yuuka</h1>
        <Image src="/yuuka/yuuka-plain.jpg" alt="yuuka" />

        <DataSourceNode_Supabase {...childProps} />
        <DataSourceNode_Api {...childProps} />
        <DataSourceNode_DragAndDrop {...childProps} />
        <DataSourceNode_Blank {...childProps} />

        <hr />

        <SupabaseSignOutButton />

        <hr />

        <footer>
          <p>
            <a href="https://github.com/if1live/yuuka">github</a>
          </p>
        </footer>
      </Container>
    );
  }

  if (dataSource._tag === "api") {
    return (
      <DataSourceContext.Provider value={dataSource}>
        <SWRConfig value={{ fetcher: fetcherWithHttp() }}>
          {props.children}
        </SWRConfig>
      </DataSourceContext.Provider>
    );
  }

  return (
    <DataSourceContext.Provider value={dataSource}>
      <SWRConfig value={{ fetcher: fetcherWithApp(dataSource.app) }}>
        {props.children}
      </SWRConfig>
    </DataSourceContext.Provider>
  );
};
