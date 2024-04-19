import { Table, Text } from "@mantine/core";
import * as R from "remeda";
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
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>date</Table.Th>
            <Table.Th>brief</Table.Th>
            <Table.Th>code</Table.Th>
            <Table.Th>debit</Table.Th>
            <Table.Th>credit</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
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
        </Table.Tbody>

        <Table.Tfoot>
          <Table.Tr>
            <Table.Th> </Table.Th>
            <Table.Th> </Table.Th>
            <Table.Th>
              {sum_debit !== sum_credit ? "unbalanced!" : null}
            </Table.Th>
            <Table.Th>
              <CurrencyDisplay amount={sum_debit} fw={500} />
            </Table.Th>
            <Table.Th>
              <CurrencyDisplay amount={sum_credit} fw={500} />
            </Table.Th>
          </Table.Tr>
        </Table.Tfoot>
      </Table>
    </>
  );
};
