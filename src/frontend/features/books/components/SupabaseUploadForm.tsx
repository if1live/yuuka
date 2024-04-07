import { useContext, useState } from "react";
import { Button } from "semantic-ui-react";
import { supabase } from "../../../constants.js";
import { DataSourceContext } from "../../../providers/DataSourceContext.js";
import { RemoteStore } from "../../../providers/RemoteStore.js";

const loadUserId = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  const id = data.session?.user.id;
  if (!id) throw new Error("user id is null");

  return id;
};

export const SupabaseUploadForm = () => {
  const dataSource = useContext(DataSourceContext);
  const { session } = dataSource;

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<object | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const handleUpload = async () => {
    const sqlite = dataSource._tag !== "api" ? dataSource.sqlite : null;
    if (!sqlite) {
      console.log("sqlite is null");
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      setError(null);

      const userId = await loadUserId();
      const result = await RemoteStore.upload(userId, sqlite);

      setResult(result);
      setError(null);
    } catch (e) {
      setResult(null);
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div>
        <h3>upload not supported</h3>
      </div>
    );
  }

  return (
    <div>
      <h3>upload</h3>

      <Button onClick={handleUpload} loading={loading}>
        upload
      </Button>

      {result && (
        <p>
          <h4>result</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </p>
      )}
      {error && (
        <p>
          <h4>error: {error.name}</h4>
          <p>{error.message}</p>
          <p>{error.stack}</p>
        </p>
      )}
    </div>
  );
};
