import { JournalEntry, journalSpecification } from "@yuuka/core";
import { Link, useParams } from "react-router-dom";
import useSWRImmutable from "swr/immutable";
import { fetcher } from "../../../fetchers";
import { JournalEntryList } from "../components/JournalEntryList";
import { Button } from "semantic-ui-react";

export const JournalEntryReadPage = () => {
  const sheet = journalSpecification.dataSheet;
  const spec = sheet.get;

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

  return <JournalEntryReadView req={req} resp={resp} />;
};

const JournalEntryReadView = (props: {
  req: (typeof journalSpecification.dataSheet.get)["inout"]["_in"];
  resp: (typeof journalSpecification.dataSheet.get)["inout"]["_out"];
}) => {
  const { req, resp } = props;

  const { id } = req;
  const entry: JournalEntry = resp;
  const result = JournalEntry.safeValidate(entry);

  return (
    <>
      <h1>Journal Entry: {id}</h1>

      {result.isErr() ? <h2>error: {result.error.message}</h2> : null}
      <JournalEntryList entries={[entry]} />

      <Button as={Link} to={`/journal/entry/${id}/edit`}>
        edit
      </Button>
    </>
  );
};
