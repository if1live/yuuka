import { Link, useParams } from "react-router-dom";
import { Button } from "semantic-ui-react";
import useSWR from "swr";
import { JournalController } from "../../../../controllers/mod.js";
import { Journal, JournalApi } from "../../../../index.js";
import { JournalList } from "../components/JournalList.js";

export const JournalReadPage = () => {
  const params = useParams();
  const req = JournalController.GetReq.parse(params);
  const qs = new URLSearchParams(req);

  const url = `${JournalApi.path}/transaction/${req.id}`;
  const { data, error, isLoading } = useSWR(url);
  const resp = data as JournalController.GetResp;

  if (error) {
    return <div>failed to load</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  return <JournalReadView req={req} resp={resp} />;
};

const JournalReadView = (props: {
  req: JournalController.GetReq;
  resp: JournalController.GetResp;
}) => {
  const { req, resp } = props;

  const { id } = req;
  const entry = resp as Journal;
  const result = Journal.safeValidate(entry);

  return (
    <>
      <h1>Journal Entry: {id}</h1>

      {result.isErr ? <h2>error: {result.error.message}</h2> : null}
      <JournalList entries={[entry]} />

      <Button as={Link} to={`/journal/entry/${id}/edit`}>
        edit
      </Button>
    </>
  );
};
