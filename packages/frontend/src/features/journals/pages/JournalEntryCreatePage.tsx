import type { JournalEntry } from "@yuuka/core";
import { useContext } from "react";
import { MasterDataContext } from "../../../contexts/MasterDataContext";
import { JournalEntryForm } from "../components/JournalEntryForm";

export const JournalEntryCreatePage = () => {
  const masterdata = useContext(MasterDataContext);

  const now = new Date();

  const pad = (n: number) => `${n}`.padStart(2, "0");
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const h = pad(now.getHours());
  const m = pad(now.getMinutes());
  const s = pad(now.getSeconds());

  // 장부에 기록될떄는 KST만 있는게 읽기 쉽다.
  const date = `${yyyy}-${mm}-${dd}`;

  // id는 시간기준으로 자동발급해도 큰 문제 없을듯
  const id = `${yyyy - 2000}${mm}${dd}_${h}${m}${s}`;

  const defaultValue: JournalEntry = {
    brief: "",
    date,
    id,
    lines: [
      { code: 930_000, _tag: "debit", debit: 0 },
      { code: 960_000, _tag: "credit", credit: 0 },
    ],
  };

  const onSubmit = async (data: JournalEntry) => {
    console.log(data);
  };

  return (
    <>
      <h1>Journal Entry: create</h1>
      <JournalEntryForm defaultValue={defaultValue} onSubmit={onSubmit} />
    </>
  );
};
