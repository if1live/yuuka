import initSqlJs, { type Database } from "sql.js";

/**
 * locateFile을 설정하지 않으면 wasm 제대로 못받아서 터진다
 * https://stackoverflow.com/a/75806317
 * https://sql.js.org/#/?id=usage
 * locateFile을 외부로 쓰는건 좀 멍청한거같지만 일단 작동하니까 유지
 *
 * top-level async/await 함수로 쓰면 vite에서 빌드 에러 발생!
 * 함수 자체를 async로 유지하고 사용하는 지점에서 await
 */
export const prepareSqlJs = async () => {
  const sqlJs = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });
  return sqlJs;
};
