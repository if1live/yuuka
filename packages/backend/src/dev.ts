import { serve } from "@hono/node-server";
import { app } from "./app.js";

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});
