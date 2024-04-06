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
    assert.equal(actaul.lines.length, 3);

    const line1 = actaul.lines[0];
    if (line1?._tag === "debit") {
      assert.equal(line1.code, 853000);
      assert.equal(line1.debit, 7740);
    } else {
      assert.fail("line1._tag is not debit");
    }

    const line3 = actaul.lines[2];
    if (line3?._tag === "credit") {
      assert.equal(line3.code, 102101);
      assert.equal(line3.credit, 15480);
    } else {
      assert.fail("line3._tag is not credit");
    }
  });
});
