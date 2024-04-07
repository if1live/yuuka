import assert from "node:assert/strict";
import { describe, it } from "vitest";
import {
  type JournalItemRecord,
  JournalLoader,
} from "../../src/synchronizations/JournalLoader.js";

describe("JournalLoader", () => {
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
    const results = JournalLoader.convert({
      ymd: { year: 2024, month: 3 },
      records,
    });
    const actaul = results.entries[0];
    assert.ok(actaul);

    assert.equal(actaul.date, skel.date);
    assert.equal(actaul.id, skel.txid);
    assert.equal(actaul.brief, skel.brief);

    assert.equal(actaul.lines_debit.length, 2);
    assert.equal(actaul.lines_credit.length, 1);

    const line1 = actaul.lines_debit[0];
    assert.ok(line1);
    assert.equal(line1.code, 853000);
    assert.equal(line1.debit, 7740);

    const line3 = actaul.lines_credit[0];
    assert.ok(line3);
    assert.equal(line3.code, 102101);
    assert.equal(line3.credit, 15480);
  });
});
