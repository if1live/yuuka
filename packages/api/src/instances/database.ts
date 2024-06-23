import { KyselyFactory } from "../rdbms/KyselyFactory.js";
import type { MyDatabase, MyKysely } from "../rdbms/types.js";
import { settings } from "../settings/index.js";

const dialect = await KyselyFactory.createDialect(settings.DATABASE_URL);
export const db: MyKysely = KyselyFactory.createKysely<MyDatabase>(dialect);
