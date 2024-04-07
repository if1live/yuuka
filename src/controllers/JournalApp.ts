// import { engine } from "../instances.js";
import { MyRequest } from "../networks/types.js";
import { createHonoApp } from "./helpers.js";
import { JournalController as Controller } from "./mod.js";

export const app = createHonoApp();

/*
app.get("/", async (c) => {
  const html = await engine.renderFile("journals/journal_index", {});
  return c.html(html);
});
*/

app.get("/list", async (c) => {
  const { db } = c.env;
  const body = Controller.ListReq.parse(c.req.query());
  const req = new MyRequest(body, { db });
  const resp = await Controller.list(req);
  return c.json(resp);
});

app.get("/transaction/:id", async (c) => {
  const { db } = c.env;
  const body = Controller.GetReq.parse({
    id: c.req.param("id"),
  });
  const req = new MyRequest(body, { db });
  const resp = await Controller.get(req);
  return c.json(resp);
});

app.post("/transaction", async (c) => {
  const { db } = c.env;
  const body = Controller.CreateReq.parse(await c.req.json());
  const req = new MyRequest(body, { db });
  const resp = await Controller.create(req);
  return c.json(resp);
});

app.post("/transaction/:id", async (c) => {
  const { db } = c.env;
  const body = Controller.CreateReq.parse(await c.req.json());
  const req = new MyRequest(body, { db });
  const resp = await Controller.update(req);
  return c.json(resp);
});

app.delete("/transaction/:id", async (c) => {
  const { db } = c.env;
  const body = Controller.RemoveReq.parse({
    id: c.req.param("id"),
  });
  const req = new MyRequest(body, { db });
  const resp = await Controller.remove(req);
  return c.json(resp);
});

export const path = "/journal" as const;
