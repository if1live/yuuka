import assert from "node:assert/strict";
import { describe, it } from "vitest";
import {
  JournalEntryLoader,
  type JournalItemRecord,
} from "../../src/journals/JournalEntryLoader.js";

describe("JournalEntryLoader", () => {
  it("ok", () => {
    const skel = {
      date: "2024-03-01",
      txid: "1",
      brief: "마트에서 식비/주류 네이버페이로",
    } as const;

    const records: JournalItemRecord[] = [
      { ...skel, code: 853000, debit: 7740, credit: null },
      { ...skel, code: 854000, debit: 7740, credit: null },
      { ...skel, code: 102101, debit: null, credit: 15480 },
    ];
    const results = JournalEntryLoader.convert({ records });
    const actaul = results[0];
    assert.ok(actaul);

    assert.equal(actaul.date, skel.date);
    assert.equal(actaul.txid, skel.txid);
    assert.equal(actaul.brief, skel.brief);
    assert.equal(actaul.lines.length, 3);

    const line1 = actaul.lines[0];
    assert.ok(line1);
    assert.equal(line1.code, 853000);
    assert.equal(line1.debit, 7740);
    assert.equal(line1.credit, null);

    const line3 = actaul.lines[2];
    assert.ok(line3);
    assert.equal(line3.code, 102101);
    assert.equal(line3.debit, null);
    assert.equal(line3.credit, 15480);
  });
});
