import {
  CamelCasePlugin,
  type Dialect,
  Kysely,
  type KyselyConfig,
  type KyselyPlugin,
  ParseJSONResultsPlugin,
  PostgresDialect,
  SqliteDialect,
  WithSchemaPlugin,
} from "kysely";

const options: Omit<KyselyConfig, "dialect"> = {
  // log: ["query", "error"],
};

const createKysely = <T>(dialect: Dialect) => {
  let plugins_dialect: KyselyPlugin[] = [];
  if (dialect instanceof PostgresDialect) {
    plugins_dialect = [...plugins_dialect, new WithSchemaPlugin("yuuka")];
  }

  const plugins: KyselyPlugin[] = [
    new ParseJSONResultsPlugin(),
    new CamelCasePlugin(),
    ...plugins_dialect,
  ];

  return new Kysely<T>({
    ...options,
    dialect,
    plugins,
  });
};

const createDialect_postgres = async (url: URL) => {
  const pgPkg = await import("pg");
  const pg = pgPkg.default;

  const database = url.pathname.replace("/", "");

  const pool = new pg.Pool({
    database,
    host: url.hostname,
    user: url.username,
    password: url.password,
    port: Number.parseInt(url.port),
    max: 10,
  });

  const dialect = new PostgresDialect({ pool });
  return dialect;
};

// 프로덕션 빌드에 넣고 싶지 않다
const createDialect_sqljs = async (buffer: Uint8Array) => {
  const initSqlJs = await import("sql.js");
  const { SqlJsDialect } = await import("kysely-wasm");

  const SQL = await initSqlJs.default({});
  const database = new SQL.Database(buffer);
  const dialect = new SqlJsDialect({ database });
  return dialect;
};

// 프로덕션 빌드에 넣고 싶지 않다
const createDialect_sqlite = async (filename: string) => {
  const SQLite = await import("better-sqlite3");
  const dialect = new SqliteDialect({
    database: new SQLite.default(filename),
  });
  return dialect;
};

const createDialect = async (input: string) => {
  if (input.startsWith("postgres://")) {
    const url = new URL(input);
    return createDialect_postgres(url);
  }

  if (input.startsWith("file://")) {
    const filename = input.replace("file://", "");
    return await createDialect_sqlite(filename);
  }

  if (!input) {
    return await createDialect_sqlite("sqlite.db");
  }

  throw new Error(`Unsupported database URL: ${input}`);
};

export const KyselyFactory = {
  createKysely,
  createDialect,
  createDialect_postgres,
  createDialect_sqljs,
  createDialect_sqlite,
};
