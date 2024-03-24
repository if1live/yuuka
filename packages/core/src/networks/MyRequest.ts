import type { KyselyDB } from "@yuuka/db";

export class MyRequest<T> {
  constructor(
    private readonly params: {
      body: T;
      db: KyselyDB;
    },
  ) {}

  get body(): T {
    return this.params.body;
  }

  get db(): KyselyDB {
    return this.params.db;
  }
}
