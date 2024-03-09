import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { JournalController } from "./controllers/JournalController.js";
import { LedgerController } from "./controllers/LedgerController.js";
import { ResourceController } from "./controllers/ResourceController.js";
import { SampleController } from "./controllers/SampleController.js";
import {
  journalSpecification,
  ledgerSpecification,
  resourceSpecification,
  sampleSpecification,
} from "./specifications/index.js";

export const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.route(sampleSpecification.resource, SampleController.app);
app.route(resourceSpecification.resource, ResourceController.app);
app.route(journalSpecification.resource, JournalController.app);
app.route(ledgerSpecification.resource, LedgerController.app);
