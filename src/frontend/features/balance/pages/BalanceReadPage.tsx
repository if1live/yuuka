import { Table } from "@mantine/core";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { BalanceApi, BalanceController } from "../../../../index.js";
import type { DateText } from "../../../../index.js";
import { CurrencyDisplay } from "../../../components/CurrencyDisplay.js";

export const BalanceReadPage = () => {
  const params = useParams();
  const req = BalanceController.GetReq.parse(params);
  const url = `${BalanceApi.path}/${req.code}/${req.date}`;
  const { data, error, isLoading } = useSWR(url);
  const resp = data as BalanceController.GetResp;

  if (error) {
    return <div>failed to load</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  return <BalanceReadView req={req} resp={resp} />;
};

const BalanceReadView = (props: {
  req: BalanceController.GetReq;
  resp: BalanceController.GetResp;
}) => {
  const { req, resp } = props;
  const { date, code } = req;
  const { statement, ledgers, balance } = resp;

  return (
    <>
      <h1>balance: {code}</h1>
      <BalanceTable
        date={date}
        ledgers={ledgers}
        statement={statement}
        balance={balance}
      />
    </>
  );
};

const BalanceTable = (props: {
  date: DateText;
  statement: BalanceController.GetResp["statement"];
  ledgers: BalanceController.GetResp["ledgers"];
  balance: BalanceController.GetResp["balance"];
}) => {
  const { date, statement, ledgers, balance } = props;

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>date</Table.Th>
          <Table.Th>brief</Table.Th>
          <Table.Th>debit</Table.Th>
          <Table.Th>credit</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {statement ? <StatementRow statement={statement} /> : null}

        {ledgers.map((ledger) => (
          <LedgerRow key={ledger.id} ledger={ledger} />
        ))}
      </Table.Tbody>

      <Table.Tfoot>
        <Table.Tr>
          <Table.Th>{date}</Table.Th>
          <Table.Th> </Table.Th>
          <Table.Th>
            <CurrencyDisplay amount={balance.debit} />
          </Table.Th>
          <Table.Th>
            <CurrencyDisplay amount={balance.credit} />
          </Table.Th>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{date}</Table.Th>
          <Table.Th>debit - credit</Table.Th>
          <Table.Th>
            <CurrencyDisplay amount={balance.balance} />
          </Table.Th>
          <Table.Th> </Table.Th>
        </Table.Tr>
      </Table.Tfoot>
    </Table>
  );
};

const StatementRow = (props: {
  statement: NonNullable<BalanceController.GetResp["statement"]>;
}) => {
  const { statement } = props;
  const debit = statement.totalDebit;
  const credit = statement.totalCredit;
  return (
    <Table.Tr>
      <Table.Td>{statement.date}</Table.Td>
      <Table.Td>{statement.date}</Table.Td>
      <Table.Td>
        {debit > 0 ? <CurrencyDisplay amount={debit} /> : null}
      </Table.Td>
      <Table.Td>
        {credit > 0 ? <CurrencyDisplay amount={credit} /> : null}
      </Table.Td>
    </Table.Tr>
  );
};

const LedgerRow = (props: {
  ledger: BalanceController.GetResp["ledgers"][number];
}) => {
  const { ledger } = props;
  return (
    <Table.Tr>
      <Table.Td>{ledger.date}</Table.Td>
      <Table.Td>{ledger.brief}</Table.Td>
      <Table.Td>
        {ledger.debit > 0 ? <CurrencyDisplay amount={ledger.debit} /> : null}
      </Table.Td>
      <Table.Td>
        {ledger.credit > 0 ? <CurrencyDisplay amount={ledger.credit} /> : null}
      </Table.Td>
    </Table.Tr>
  );
};
