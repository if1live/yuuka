import { Table } from "@mantine/core";
import type { JournalEntry } from "@yuuka/api";
import * as R from "remeda";
import { CurrencyDisplay } from "../../../components/CurrencyDisplay.js";
import { JournalEntryBlock } from "./JournalEntryBlock.js";

export const JournalEntryList = (props: {
  entries: JournalEntry[];
}) => {
  const { entries } = props;

  const commodity_credit = R.pipe(
    entries,
    R.flatMap((x) => x.lines_credit),
    R.map((x) => x.commodity),
  );
  const commodity_debit = R.pipe(
    entries,
    R.flatMap((x) => x.lines_debit),
    R.map((x) => x.commodity),
  );
  const commodity_list = R.unique([...commodity_credit, ...commodity_debit]);

  type SumResult = {
    commodity: string;
    sum_debit: number;
    sum_credit: number;
  };

  const sum_results = commodity_list.map((commodity): SumResult => {
    const sum_debit = R.pipe(
      entries,
      R.flatMap((x) => x.lines_debit),
      R.filter((x) => x.commodity === commodity),
      R.sumBy((x) => x.debit),
    );

    const sum_credit = R.pipe(
      entries,
      R.flatMap((x) => x.lines_credit),
      R.filter((x) => x.commodity === commodity),
      R.sumBy((x) => x.credit),
    );

    return {
      commodity,
      sum_debit,
      sum_credit,
    };
  });

  return (
    <>
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>account</Table.Th>
            <Table.Th>debit</Table.Th>
            <Table.Th>credit</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {entries.map((entry, order) => (
            <JournalEntryBlock key={entry.id} entry={entry} order={order} />
          ))}
        </Table.Tbody>

        <Table.Tfoot>
          {sum_results.map((x) => (
            <Table.Tr key={x.commodity}>
              <Table.Th>
                {x.sum_debit !== x.sum_credit ? "unbalanced!" : null}
              </Table.Th>
              <Table.Th>
                <CurrencyDisplay
                  amount={x.sum_debit}
                  fw={500}
                  currency={x.commodity}
                />
              </Table.Th>
              <Table.Th>
                <CurrencyDisplay
                  amount={x.sum_credit}
                  fw={500}
                  currency={x.commodity}
                />
              </Table.Th>
            </Table.Tr>
          ))}
        </Table.Tfoot>
      </Table>
    </>
  );
};
