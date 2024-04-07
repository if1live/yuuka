import { useParams } from "react-router-dom";
import useSWR from "swr";
import { JournalController } from "../../../../controllers/mod.js";
import { JournalApp } from "../../../../index.js";
import type { Journal } from "../../../../journals/models/Journal.js";
import { JournalList } from "../components/JournalList.js";

// TODO: 노가다 코딩 줄이는 방법? swr에서 표준화 시켜야할듯?
export const JournalListPage = () => {
  const params = useParams();
  const req = JournalController.ListReq.parse(params);
  const qs = new URLSearchParams(req);

  const endpoint = `${JournalApp.path}/list`;
  const url = `${endpoint}?${qs}`;

  const { data, error, isLoading } = useSWR(url);
  const resp = data as JournalController.ListResp;

  if (error) {
    return <div>failed to load</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  return <JournalListView req={req} resp={resp} />;
};

const JournalListView = (props: {
  req: JournalController.ListReq;
  resp: JournalController.ListResp;
}) => {
  const { req, resp } = props;

  const { startDate, endDate } = req;
  const entries = resp as unknown as Journal[];

  return (
    <>
      <h1>Journals</h1>
      <h2>
        {startDate} ~ {endDate}
      </h2>
      <JournalList entries={entries} />
    </>
  );
};
