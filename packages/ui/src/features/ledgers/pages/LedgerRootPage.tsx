import { Button, Container, Divider, Group, Table } from "@mantine/core";
import type { JournalEntry, LedgerController } from "@yuuka/api";
import { Fragment } from "react/jsx-runtime";
import useSWR, { mutate } from "swr";
import { myfetch } from "../../../fetchers";
import { LedgerCodeView } from "../../journals/components/LedgerCodeView";
import { LedgerCopyButton } from "../../journals/components/LedgerCopyButton";

const endpoint_list = "/api/ledger/list";

export const LedgerRootPage = () => {
  const { data, error, isLoading } = useSWR(endpoint_list, myfetch);
  const resp = data as LedgerController.ListResp;

  if (error) {
    return <div>failed to load masterdata</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  return <LedgerRootView entries={resp} />;
};

const LedgerRootView = (props: {
  entries: JournalEntry[];
}) => {
  const { entries } = props;
  return (
    <Container>
      <h1>ledger: {entries.length}</h1>
      {entries.map((entry, idx) => (
        <Fragment key={idx.toString()}>
          <LedgerBlock key={entry.id} entry={entry} />
          <Divider my="sm" />
        </Fragment>
      ))}
    </Container>
  );
};

const LedgerBlock = (props: {
  entry: JournalEntry;
}) => {
  const { entry } = props;

  const handleClick = async () => {
    const ok = confirm(`remove? ${entry.date} ${entry.brief}`);
    if (!ok) {
      return;
    }

    const endpoint = `/api/ledger/remove/${entry.id}`;
    const resp = await myfetch(endpoint, {
      method: "POST",
    });

    mutate(endpoint_list);
  };

  return (
    <>
      <LedgerCodeView entry={entry} />
      <Group>
        <LedgerCopyButton entry={entry} variant="default" size="xs" />
        <Button onClick={handleClick} color="red" size="xs">
          remove
        </Button>
      </Group>
    </>
  );
};
