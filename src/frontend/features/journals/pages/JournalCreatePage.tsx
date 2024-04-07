import { useContext, useState } from "react";
import type { DateText } from "../../../../core/types.js";
import { type Journal, JournalApi } from "../../../../index.js";
import { MyFetch } from "../../../fetchers/index.js";
import { DataSourceContext } from "../../../providers/DataSourceContext.js";
import { JournalForm } from "../components/JournalForm.js";

export const JournalCreatePage = () => {
  const dataSource = useContext(DataSourceContext);

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
  const date = `${yyyy}-${mm}-${dd}` as DateText;

  // id는 시간기준으로 자동발급해도 큰 문제 없을듯
  const id = `${yyyy - 2000}${mm}${dd}_${h}${m}${s}`;

  const defaultValue: Journal = {
    brief: "",
    date,
    id,
    lines_debit: [
      { code: 960_000, _tag: "debit", debit: 0 }, // 잡손실
    ],
    lines_credit: [
      { code: 930_000, _tag: "credit", credit: 0 }, // 잡이익
    ],
  };

  const onSubmit = async (data: Journal) => {
    try {
      const path = `${JournalApi.path}/transaction`;
      const resp = await MyFetch.doPost(dataSource, path, data);
      const json = await resp.json();

      setResult(json);
      setError(null);
    } catch (e) {
      setResult(null);
      setError(e as Error);
    }
  };

  return (
    <>
      <h1>Journal: create</h1>
      <JournalForm defaultValue={defaultValue} onSubmit={onSubmit} />

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
    </>
  );
};
