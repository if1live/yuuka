import fs from "node:fs/promises";
import path from "node:path";
import {
  CamelCasePlugin,
  Kysely,
  PostgresDialect,
  WithSchemaPlugin,
} from "kysely";
import { SqlJsDialect } from "kysely-wasm";
import initSqlJs from "sql.js";
import { z } from "zod";
import type { MyDatabase } from "../src/rdbms/types.js";
import { AccountTable, PresetTable } from "../src/tables/index.js";

const configSchema = z.object({
  userId: z.string(),
});

const accountSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const presetSchema = z.object({
  name: z.string(),
  brief: z.string(),
  lines_debit: z.array(
    z.object({
      account: z.string(),
      debit: z.number(),
      commodity: z.string(),
    }),
  ),
  lines_credit: z.array(
    z.object({
      account: z.string(),
      credit: z.number(),
      commodity: z.string(),
    }),
  ),
});

const dataPath = "./etc/";

const readConfig = async () => {
  const fp = path.resolve(dataPath, "config.json");
  const text = await fs.readFile(fp, "utf-8");
  const config = configSchema.parse(JSON.parse(text));
  return config;
};

const readAccount = async () => {
  const fp = path.resolve(dataPath, "fixture_account.json");
  const text = await fs.readFile(fp, "utf-8");
  const schema = z.array(accountSchema);
  const items = schema.parse(JSON.parse(text));
  return items;
};

const readPreset = async () => {
  const fp = path.resolve(dataPath, "fixture_preset.json");
  const text = await fs.readFile(fp, "utf-8");
  const schema = z.array(presetSchema);
  const items = schema.parse(JSON.parse(text));
  return items;
};

const config = await readConfig();
const { userId } = config;

const accounts = await readAccount();
const presets = await readPreset();

const query_schema = async (db: Kysely<MyDatabase>) => {
  const sqls = [
    AccountTable.defineSchema_pg(db).compile().sql,
    PresetTable.defineSchema_pg(db).compile().sql,
  ];
  for (const sql of sqls) {
    console.log(`${sql};`);
  }
};

const execute_schema = async (db: Kysely<MyDatabase>) => {
  await AccountTable.defineSchema_sqlite(db).execute();
  await PresetTable.defineSchema_sqlite(db).execute();
};

const query_account = async (db: Kysely<MyDatabase>) => {
  // 복사해서 바로 돌릴수 있는 쿼리를 기대
  for (const item of accounts) {
    const sql = `
insert into "yuuka"."account" ("user_id", "name", "description")
values ('${userId}', '${item.name}', '${item.description}');`.trimStart();
    console.log(sql);
  }
};

const execute_account = async (db: Kysely<MyDatabase>) => {
  const items = accounts.map((item): AccountTable.NewRow => {
    return {
      userId,
      name: item.name,
      description: item.description,
    };
  });

  await db.insertInto(AccountTable.name).values(items).execute();
};

const query_preset = async (db: Kysely<MyDatabase>) => {
  for (const item of presets) {
    const sql = `
insert into "yuuka"."preset" ("user_id", "name", "brief", "lines_debit", "lines_credit")
values ('${userId}', '${item.name}', '${item.brief}',
'${JSON.stringify(item.lines_debit)}',
'${JSON.stringify(item.lines_credit)}');`.trimStart();
    console.log(sql);
  }
};

const execute_preset = async (db: Kysely<MyDatabase>) => {
  const items = presets.map((item): PresetTable.NewRow => {
    return {
      userId,
      name: item.name,
      brief: item.brief,
      lines_debit: JSON.stringify(item.lines_debit),
      lines_credit: JSON.stringify(item.lines_credit),
    };
  });

  for (const item of items) {
    await db.insertInto(PresetTable.name).values(item).execute();
  }
};

const main_pg = async () => {
  const dialect = new PostgresDialect({
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    pool: {} as unknown as any,
  });
  const db = new Kysely<MyDatabase>({
    dialect,
    plugins: [new CamelCasePlugin(), new WithSchemaPlugin("yuuka")],
  });

  await query_schema(db);
  console.log();

  await query_account(db);
  console.log();

  await query_preset(db);
  console.log();
};

const main_sqlite = async () => {
  // db
  const filename = "sqlite.db";
  await fs.unlink(filename).catch(() => {});

  const SQL = await initSqlJs({});
  const database = new SQL.Database([]);
  const dialect = new SqlJsDialect({
    database: database,
  });
  const db = new Kysely<MyDatabase>({
    dialect,
    plugins: [new CamelCasePlugin()],
  });

  await execute_schema(db);
  await execute_account(db);
  await execute_preset(db);

  const bytes = database.export();
  await fs.writeFile(filename, Buffer.from(bytes));
};

// await main_pg();
await main_sqlite();
