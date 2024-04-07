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
import type { Journal } from "../../../../journals/models/Journal.js";
import { CurrencyDisplay } from "../../../components/index.js";
import { JournalBlock } from "./JournalBlock.js";

export const JournalList = (props: {
  entries: Journal[];
}) => {
  const { entries } = props;

  const sum_debit = R.pipe(
    entries,
    R.flatMap((x) => x.lines_debit),
    R.sumBy((x) => x.debit),
  );

  const sum_credit = R.pipe(
    entries,
    R.flatMap((x) => x.lines_credit),
    R.sumBy((x) => x.credit),
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
              <JournalBlock
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
