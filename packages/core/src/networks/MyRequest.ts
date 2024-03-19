import type { KyselyDB } from "@yuuka/db";

export class MyRequest<T> {
  constructor(
    private readonly params: {
      body: T;
      db: KyselyDB;
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

  get db(): KyselyDB {
    return this.params.db;
  }
}
