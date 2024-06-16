import { Table, Text } from "@mantine/core";
import { JournalEntry } from "../../../../ledgers/JournalEntry.js";
import { CurrencyDisplay } from "../../../components/CurrencyDisplay.js";

/** journal line을 Table.Tr로 표현 */
export const JournalLineRow = (props: {
  account: string;
  commodity: string;
  debit?: number;
  credit?: number;
}) => {
  const { account, debit, credit, commodity } = props;

  return (
    <Table.Tr>
      <Table.Td>{account}</Table.Td>

      <Table.Td>
        {debit ? <CurrencyDisplay amount={debit} currency={commodity} /> : null}
      </Table.Td>

      <Table.Td>
        {credit ? (
          <CurrencyDisplay amount={credit} currency={commodity} />
        ) : null}
      </Table.Td>
    </Table.Tr>
  );
};
