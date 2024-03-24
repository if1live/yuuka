import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { DataSourceValue } from "../contexts/DataSourceContext";
import { type DataSourceNodeProps, createApp } from "./dataSourceNodes";

export const DataSourceNode_DragAndDrop = (props: DataSourceNodeProps) => {
  const fileTypes = ["sqlite", "db"];

  const { setDataSource, setError } = props;

  const [file, setFile] = useState<File | null>(null);

  const handleChange = async (file: File) => {
    setFile(file);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const { dialect, sqlite } =
        await DataSourceValue.createDialect_arrayBuffer(arrayBuffer);
      const db = DataSourceValue.createKysely(dialect);
      const app = createApp(db);
      setDataSource({ _tag: "sandbox", sqlite, db, app });
    } catch (e) {
      setError(e as Error);
    }
  };

  return (
    <>
      <h3>drag and drop</h3>
      <FileUploader
        multiple={false}
        handleChange={handleChange}
        name="file"
        types={fileTypes}
      />
      <p>{file ? `File name: ${file.name}` : "no files uploaded yet"}</p>
    </>
  );
};
