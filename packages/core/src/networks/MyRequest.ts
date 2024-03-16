import type { Database } from "@yuuka/db";
import type { Kysely } from "kysely";

export class MyRequest<T> {
  constructor(
    private readonly params: {
      body: T;
      db: Kysely<Database>;
      userId?: number;
    },
  ) {}

  get body(): T {
    return this.params.body;
  }

  get userId(): number {
    const v = this.params.userId;
    if (!v) {
      throw new Error("userId is not set");
    }
    return v;
  }

  get db(): Kysely<Database> {
    return this.params.db;
  }
}
