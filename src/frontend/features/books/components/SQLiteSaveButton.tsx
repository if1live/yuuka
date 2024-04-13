import { Button } from "@mantine/core";
import type { Database } from "sql.js";

const downloadArrayBuffer = (
  bytes: Uint8Array,
  fileName: string,
  mimeType: string,
) => {
  // ArrayBuffer로부터 Blob 객체 생성
  const blob = new Blob([bytes], { type: mimeType });

  // Blob 객체로부터 URL 생성
  const url = window.URL.createObjectURL(blob);

  // a 태그를 생성하여 프로그램적으로 클릭하여 파일 다운로드를 트리거
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link); // 필요한 경우 DOM에 임시로 추가
  link.click();

  // 다운로드 후 사용한 객체 정리
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const SQLiteSaveButton = (props: { sqlite: Database }) => {
  const { sqlite } = props;
  const bytes = sqlite.export();

  // TODO: 파일명에 날짜같은거 넣어서 고유하게 만들까?
  const filename = "book.sqlite";

  const handleDownload = () => {
    downloadArrayBuffer(bytes, filename, "application/x-sqlite3");
  };

  return <Button onClick={handleDownload}>save sqlite</Button>;
};
