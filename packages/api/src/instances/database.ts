import { KyselyFactory } from "../rdbms/KyselyFactory.js";
import { settings } from "../settings/index.js";

const dialect = await KyselyFactory.createDialect(settings.DATABASE_URL);
export const db = KyselyFactory.createKysely(dialect);
