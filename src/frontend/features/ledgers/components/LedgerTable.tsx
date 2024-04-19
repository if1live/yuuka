import { Table } from "@mantine/core";
import * as R from "remeda";
import { CurrencyDisplay } from "../../../components/CurrencyDisplay.js";
import { JournalLink } from "../../../components/misc.js";

type Line = {
  id: string;
  brief: string;
  date: string;

  debit: number;
  credit: number;
  balance: number;
};

export const LedgerTable = (props: {
  lines: Line[];
}) => {
  const { lines } = props;

  const sum_debit = R.sumBy(lines, (line) => line.debit);
  const sum_credit = R.sumBy(lines, (line) => line.credit);

  return (
    <Table withColumnBorders highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>일자</Table.Th>
          <Table.Th>적요</Table.Th>
          <Table.Th>debit</Table.Th>
          <Table.Th>credit</Table.Th>
          <Table.Th>balance</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {lines.map((line, i) => {
          const { debit, credit, balance } = line;

          const prev = lines[i - 1];
          const displayDate = line.date !== prev?.date;

          const key = line.id;

          return (
            <Table.Tr key={key}>
              <Table.Td>{displayDate ? line.date : null}</Table.Td>
              <Table.Td>
                <JournalLink id={line.id} label={line.brief} />
              </Table.Td>
              <Table.Td>
                {debit ? <CurrencyDisplay amount={debit} /> : null}
              </Table.Td>
              <Table.Td>
                {credit ? <CurrencyDisplay amount={credit} /> : null}
              </Table.Td>
              <Table.Td>
                <CurrencyDisplay amount={balance} />
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>

      <Table.Tfoot>
        <Table.Tr>
          <Table.Th> </Table.Th>
          <Table.Th> </Table.Th>
          <Table.Th>
            <CurrencyDisplay amount={sum_debit} fw={500} />
          </Table.Th>
          <Table.Th>
            <CurrencyDisplay amount={sum_credit} fw={500} />
          </Table.Th>
          <Table.Th>
            <CurrencyDisplay
              amount={lines[lines.length - 1]?.balance ?? 0}
              fw={500}
            />
          </Table.Th>
        </Table.Tr>
      </Table.Tfoot>
    </Table>
  );
};
