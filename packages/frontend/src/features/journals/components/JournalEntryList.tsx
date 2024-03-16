import type { JournalEntry } from "@yuuka/core";
import * as R from "remeda";
import {
  Icon,
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import { CurrencyDisplay } from "../../../components";
import { JournalEntryBlock } from "./JournalEntryBlock";

export const JournalEntryList = (props: {
  entries: JournalEntry[];
}) => {
  const { entries } = props;

  const sum_debit = R.pipe(
    entries,
    R.flatMap((x) => x.lines),
    R.map((x) => (x._tag === "debit" ? x.debit : 0)),
    R.sumBy((x) => x),
  );

  const sum_credit = R.pipe(
    entries,
    R.flatMap((x) => x.lines),
    R.map((x) => (x._tag === "credit" ? x.credit : 0)),
    R.sumBy((x) => x),
  );

  return (
    <>
      <Table compact="very" selectable celled unstackable>
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

        <TableFooter>
          <TableRow negative>
            <TableHeaderCell> </TableHeaderCell>
            <TableHeaderCell> </TableHeaderCell>
            <TableHeaderCell>
              {sum_debit !== sum_credit ? "unbalanced!" : null}
            </TableHeaderCell>
            <TableHeaderCell textAlign="right">
              <CurrencyDisplay amount={sum_debit} />
            </TableHeaderCell>
            <TableHeaderCell textAlign="right">
              <CurrencyDisplay amount={sum_credit} />
            </TableHeaderCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
};
