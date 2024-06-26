import fs from "node:fs/promises";
import type { Database } from "sql.js";
import { NodeSystemError } from "../core/NodeSystemError.js";

export const exportFile = async (database: Database, fp: string) => {
  try {
    await fs.unlink(fp);
  } catch (e) {
    if (NodeSystemError.guard(e) && e.code === "ENOENT") {
      // Error: ENOENT: no such file or directory, ..
      // 없는 파일 삭제할때 발생하는 에러. 무시해도 됨
    } else {
      throw e;
    }
  }

  // sqlite 파일 용량 줄이기. 데이터 크기가 작아서 그런지 큰 효과는 없다
  database.exec("VACUUM");
  const buffer = database.export();
  await fs.writeFile(fp, buffer);
};
