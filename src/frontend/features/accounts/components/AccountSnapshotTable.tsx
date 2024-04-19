import { Anchor, Table } from "@mantine/core";
import { Link } from "react-router-dom";
import type { Account } from "../../../../accounts/models/Account.js";
import { AccountCategory } from "../../../../accounts/models/AccountCategory.js";
import type { AccountGroup } from "../../../../accounts/models/AccountGroup.js";
import { DateOnly } from "../../../../core/DateOnly.js";
import { CurrencyDisplay } from "../../../components/CurrencyDisplay.js";

type Row = { account: Account; group: AccountGroup; balance: number };

export const AccountSnapshotTable = (props: {
  items: Array<Row>;
  date: DateOnly;
}) => {
  const { date, items } = props;

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>대분류</Table.Th>
          <Table.Th>소분류</Table.Th>
          <Table.Th>계정코드</Table.Th>
          <Table.Th>이름</Table.Th>
          <Table.Th>잔액: {date}</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {items.map((row) => (
          <AccountSnapshotTableRow
            key={row.account.code}
            row={row}
            date={date}
          />
        ))}
      </Table.Tbody>
    </Table>
  );
};

const AccountSnapshotTableRow = (props: {
  row: Row;
  date: DateOnly;
}) => {
  const { row, date } = props;
  const { account, group } = row;

  const major = AccountCategory.toKorean(group.major);
  const minor = group.minor;

  const startDate = DateOnly.setDay(date, 1);
  const url = `/ledger/account/${account.code}/${startDate}/${date}`;

  return (
    <Table.Tr key={account.code}>
      <Table.Td>{major}</Table.Td>
      <Table.Td>{minor}</Table.Td>
      <Table.Td>{account.code}</Table.Td>
      <Table.Td>
        <Anchor component={Link} to={url}>
          {account.name}
        </Anchor>
      </Table.Td>
      <Table.Td>
        <CurrencyDisplay amount={row.balance} />
      </Table.Td>
    </Table.Tr>
  );
};
