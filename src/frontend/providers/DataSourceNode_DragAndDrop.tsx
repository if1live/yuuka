import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { fromBuffer, prepareSqlJs } from "../../rdbms/loader.js";
import { type DataSourceNodeProps, createApp } from "./dataSourceNodes.js";

export const DataSourceNode_DragAndDrop = (props: DataSourceNodeProps) => {
  const fileTypes = ["sqlite", "db"];

  const { setDataSource, setError } = props;

  const [file, setFile] = useState<File | null>(null);

  const handleChange = async (file: File) => {
    setFile(file);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const SQL = await prepareSqlJs();
      const { sqlite, db } = fromBuffer(SQL, buffer, {});
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
