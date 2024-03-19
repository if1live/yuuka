import { type KyselyDB, UserSchema } from "@yuuka/db";

const findByUsername = async (db: KyselyDB, username: string) => {
  return await db
    .selectFrom(UserSchema.name)
    .selectAll()
    .where("supabase", "=", username)
    .executeTakeFirst();
};

export const UserRepository = {
  findByUsername,
};
