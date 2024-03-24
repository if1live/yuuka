import { useContext, useState } from "react";
import { Button } from "semantic-ui-react";
import { supabase } from "../../../constants";
import { DataSourceContext } from "../../../contexts/DataSourceContext";
import { RemoteStore } from "../../../stores/RemoteStore";

const loadUserId = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  const id = data.session?.user.id;
  if (!id) throw new Error("user id is null");

  return id;
};

export const SupabaseUploadButton = () => {
  const dataSource = useContext(DataSourceContext);
  const session = dataSource._tag === "supabase" ? dataSource.session : null;

  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    const sqlite = dataSource._tag !== "server" ? dataSource.sqlite : null;
    if (!sqlite) {
      console.log("sqlite is null");
      return;
    }

    try {
      setLoading(true);
      const userId = await loadUserId();
      const result = await RemoteStore.upload(userId, sqlite);
      console.log(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <Button disabled>upload</Button>;
  }

  return (
    <Button onClick={handleUpload} loading={loading}>
      upload
    </Button>
  );
};
