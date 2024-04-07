import type { Hono } from "hono";
import type { DataSourceValue } from "../providers/DataSourceContext.js";

const myfetch_http = async (
  endpoint: string,
  path: string,
  init: RequestInit,
) => {
  const url = `${endpoint}${path}`;
  return fetch(url, init);
};

const myfetch_app = async (app: Hono, path: string, init: RequestInit) => {
  return await app.request(path, init);
};

export const native = async (
  dataSource: DataSourceValue,
  path: string,
  init: RequestInit,
) => {
  switch (dataSource._tag) {
    case "api":
      return await myfetch_http(dataSource.endpoint, path, init);
    default:
      return await myfetch_app(dataSource.app, path, init);
  }
};

export const doPost = async (
  dataSource: DataSourceValue,
  path: string,
  payload: object,
) => {
  return await native(dataSource, path, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
};

export const doGet = async (
  dataSource: DataSourceValue,
  path: string,
  payload: Record<string, string>,
) => {
  const qs = new URLSearchParams(payload);
  const url = `${path}?${qs.toString()}`;
  return await native(dataSource, url, {
    body: JSON.stringify(payload),
  });
};
