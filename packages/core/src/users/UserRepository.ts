import { type Database, UserSchema } from "@yuuka/db";
import type { Kysely } from "kysely";

const findByUsername = async (db: Kysely<Database>, username: string) => {
  return await db
    .selectFrom(UserSchema.name)
    .selectAll()
    .where("supabase", "=", username)
    .executeTakeFirst();
};

export const UserRepository = {
  findByUsername,
};
