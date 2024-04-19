import { Table } from "@mantine/core";
import * as R from "remeda";
import type { BalanceController } from "../../../../controllers/mod.js";
import { AccountLink } from "../../../components/AccountLink.js";
import { CurrencyDisplay } from "../../../components/CurrencyDisplay.js";
import type { DateOnly } from "../../../../core/DateOnly.js";

type AccountBalance = BalanceController.TrialBalanceResp["accounts"][number];

export const TrialBalanceTable = (props: {
  accounts: AccountBalance[];
  startDate: DateOnly;
  endDate: DateOnly;
}) => {
  const { accounts, startDate, endDate } = props;

  const debit_sum = R.sumBy(accounts, (x) => x.debit_sum);
  const credit_sum = R.sumBy(accounts, (x) => x.credit_sum);
  const debit_balance = R.sumBy(accounts, (x) => x.debit_balance);
  const credit_balance = R.sumBy(accounts, (x) => x.credit_balance);

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>차변 잔액</Table.Th>
          <Table.Th>차변 합계</Table.Th>
          <Table.Th>계정과목</Table.Th>
          <Table.Th>대변 합계</Table.Th>
          <Table.Th>대변 잔액</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {accounts.map((account) => {
          return (
            <Table.Tr key={account.code}>
              <Table.Td>
                {account.debit_balance ? (
                  <CurrencyDisplay amount={account.debit_balance} />
                ) : null}
              </Table.Td>
              <Table.Td>
                {account.debit_sum ? (
                  <CurrencyDisplay amount={account.debit_sum} />
                ) : null}
              </Table.Td>
              <Table.Td>
                <AccountLink
                  code={account.code}
                  startDate={startDate}
                  endDate={endDate}
                />
              </Table.Td>
              <Table.Td>
                {account.credit_sum ? (
                  <CurrencyDisplay amount={account.credit_sum} />
                ) : null}
              </Table.Td>
              <Table.Td>
                {account.credit_balance ? (
                  <CurrencyDisplay amount={account.credit_balance} />
                ) : null}
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>

      <Table.Tfoot>
        <Table.Tr>
          <Table.Th>
            <CurrencyDisplay amount={debit_balance} fw={500} />
          </Table.Th>
          <Table.Th>
            <CurrencyDisplay amount={debit_sum} fw={500} />
          </Table.Th>
          <Table.Th>합계</Table.Th>
          <Table.Th>
            <CurrencyDisplay amount={credit_sum} fw={500} />
          </Table.Th>
          <Table.Th>
            <CurrencyDisplay amount={credit_balance} fw={500} />
          </Table.Th>
        </Table.Tr>
      </Table.Tfoot>
    </Table>
  );
};
