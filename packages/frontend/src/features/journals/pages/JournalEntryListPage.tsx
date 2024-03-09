import { journalSpecification } from "@yuuka/core";
import { useParams } from "react-router-dom";
import useSWRImmutable from "swr/immutable";
import { fetcher } from "../../../fetchers";
import { JournalEntryList } from "../components/JournalEntryList";

// TODO: 노가다 코딩 줄이는 방법? swr에서 표준화 시켜야할듯?
export const JournalEntryListPage = () => {
  const sheet = journalSpecification.dataSheet;
  const spec = sheet.list;

  const params = useParams();
  const req = spec.schema.req.parse(params);
  const qs = new URLSearchParams(req);

  const endpoint = `${journalSpecification.resource}${spec.endpoint.path}`;

  const url = `${endpoint}?${qs}`;
  const { data, error, isLoading } = useSWRImmutable(url, fetcher);
  const resp = data as (typeof spec)["inout"]["_out"];

  if (error) {
    return <div>failed to load</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  return <JournalEntryListView req={req} resp={resp} />;
};

const JournalEntryListView = (props: {
  req: (typeof journalSpecification.dataSheet.list)["inout"]["_in"];
  resp: (typeof journalSpecification.dataSheet.list)["inout"]["_out"];
}) => {
  const { req, resp } = props;

  const { startDate, endDate } = req;
  const { entries } = resp;

  return (
    <>
      <h1>Journal Entries</h1>
      <h2>
        {startDate} ~ {endDate}
      </h2>
      <JournalEntryList entries={entries} />
    </>
  );
};
