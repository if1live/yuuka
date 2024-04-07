import type { MyKysely } from "../rdbms/types.js";

export class MyRequest<T> {
  constructor(
    private readonly _body: T,
    private readonly deps: { db: MyKysely },
  ) {}

  get body(): T {
    return this._body;
  }

  get db(): MyKysely {
    return this.deps.db;
  }
}
