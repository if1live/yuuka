import type { JournalEntry } from "@yuuka/core";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import { JournalEntryBlock } from "./JournalEntryBlock";

export const JournalEntryList = (props: {
  entries: JournalEntry[];
}) => {
  const { entries } = props;

  return (
    <>
      <Table compact="very" selectable celled>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>date</TableHeaderCell>
            <TableHeaderCell>brief</TableHeaderCell>
            <TableHeaderCell>code</TableHeaderCell>
            <TableHeaderCell>debit</TableHeaderCell>
            <TableHeaderCell>credit</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {entries.map((entry, order) => (
            <JournalEntryBlock key={entry.id} entry={entry} order={order} />
          ))}
        </TableBody>
      </Table>
    </>
  );
};
