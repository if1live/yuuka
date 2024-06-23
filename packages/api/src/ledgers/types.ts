import type { JournalLine_Credit, JournalLine_Debit } from "./JournalLine.js";

export type Preset = {
  name: string;
  brief: string;
  lines_debit: Omit<JournalLine_Debit, "_tag">[];
  lines_credit: Omit<JournalLine_Credit, "_tag">[];
};
