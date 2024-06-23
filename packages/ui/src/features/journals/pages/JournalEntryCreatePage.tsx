import { Container } from "@mantine/core";
import type { DateOnly, JournalEntry } from "@yuuka/api";
import { nanoid } from "nanoid";
import { useState } from "react";
import { myfetch } from "../../../fetchers.js";
import { JournalEntryForm } from "../components/JournalEntryForm.js";

export const JournalEntryCreatePage = () => {
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<object | null>(null);

  const now = new Date();

  const pad = (n: number) => `${n}`.padStart(2, "0");
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const h = pad(now.getHours());
  const m = pad(now.getMinutes());
  const s = pad(now.getSeconds());

  // 장부에 기록될떄는 KST만 있는게 읽기 쉽다.
  const date = `${yyyy}-${mm}-${dd}` as DateOnly;

  const defaultValue: JournalEntry = {
    date,
    brief: nanoid(),
    id: "",
    lines_debit: [
      { account: "Expenses:잡손실", _tag: "debit", debit: 0, commodity: "KRW" },
    ],
    lines_credit: [
      { account: "Income:잡이익", _tag: "credit", credit: 0, commodity: "KRW" },
    ],
  };

  const onSubmit = async (data: JournalEntry) => {
    try {
      const path = "/api/ledger/create";
      const json = await myfetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setResult(json);
      setError(null);
    } catch (e) {
      setResult(null);
      setError(e as Error);
    }
  };

  return (
    <Container>
      <h1>Journal: create</h1>
      <JournalEntryForm defaultValue={defaultValue} onSubmit={onSubmit} />

      {error && (
        <>
          <h3>error</h3>
          <pre>{error.message}</pre>
        </>
      )}

      {result && (
        <>
          <h3>success</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </>
      )}
    </Container>
  );
};
