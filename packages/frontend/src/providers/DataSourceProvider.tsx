import { type PropsWithChildren, useState } from "react";
import { Image } from "semantic-ui-react";
import { Container } from "semantic-ui-react";
import { SWRConfig } from "swr";
import {
  DataSourceContext,
  type DataSourceValue,
} from "../contexts/DataSourceContext";
import { fetcherWithApp, fetcherWithHttp } from "../fetchers";
import { DataSourceNode_Blank } from "./DataSourceNode_Blank";
import { DataSourceNode_DragAndDrop } from "./DataSourceNode_DragAndDrop";
import { DataSourceNode_RemoteFile } from "./DataSourceNode_RemoteFile";
import { DataSourceNode_Server } from "./DataSourceNode_Server";
import { DataSourceNode_Supabase } from "./DataSourceNode_Supabase";

export const DataSourceProvider = (props: PropsWithChildren) => {
  const [dataSource, setDataSource] = useState<DataSourceValue | null>(null);
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <Container text>
        <h1>yuuka</h1>

        <p>error: {error.name}</p>
        <p>{error.message}</p>
      </Container>
    );
  }

  if (dataSource === null) {
    return (
      <Container text>
        <h1>project: yuuka</h1>

        <Image src="/yuuka/yuuka-plain.jpg" />

        <DataSourceNode_Server
          setDataSource={setDataSource}
          setError={setError}
        />

        <DataSourceNode_Supabase
          setDataSource={setDataSource}
          setError={setError}
        />

        <DataSourceNode_DragAndDrop
          setDataSource={setDataSource}
          setError={setError}
        />

        <DataSourceNode_RemoteFile
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

  if (dataSource._tag === "server") {
    return (
      <DataSourceContext.Provider value={dataSource}>
        <SWRConfig value={{ fetcher: fetcherWithHttp() }}>
          {props.children}
        </SWRConfig>
      </DataSourceContext.Provider>
    );
  }

  const { app } = dataSource;
  return (
    <DataSourceContext.Provider value={dataSource}>
      <SWRConfig value={{ fetcher: fetcherWithApp(app) }}>
        {props.children}
      </SWRConfig>
    </DataSourceContext.Provider>
  );
};
