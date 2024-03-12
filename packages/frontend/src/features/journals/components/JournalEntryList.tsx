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
          {entries.map((entry, order) => {
            const prev = entries[order - 1];
            return (
              <JournalEntryBlock
                key={entry.id}
                prev={prev}
                entry={entry}
                order={order}
              />
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
