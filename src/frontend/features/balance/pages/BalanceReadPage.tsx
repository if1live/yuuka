import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
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
    <Table compact="very" selectable unstackable celled>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>date</TableHeaderCell>
          <TableHeaderCell>brief</TableHeaderCell>
          <TableHeaderCell>debit</TableHeaderCell>
          <TableHeaderCell>credit</TableHeaderCell>
        </TableRow>
      </TableHeader>

      <TableBody>
        {statement ? <StatementRow statement={statement} /> : null}

        {ledgers.map((ledger) => (
          <LedgerRow key={ledger.id} ledger={ledger} />
        ))}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableHeaderCell>{date}</TableHeaderCell>
          <TableHeaderCell> </TableHeaderCell>
          <TableHeaderCell textAlign="right">
            <CurrencyDisplay amount={balance.debit} />
          </TableHeaderCell>
          <TableHeaderCell textAlign="right">
            <CurrencyDisplay amount={balance.credit} />
          </TableHeaderCell>
        </TableRow>
        <TableRow>
          <TableHeaderCell>{date}</TableHeaderCell>
          <TableHeaderCell>debit - credit</TableHeaderCell>
          <TableHeaderCell textAlign="right">
            <CurrencyDisplay amount={balance.balance} />
          </TableHeaderCell>
          <TableHeaderCell textAlign="right"> </TableHeaderCell>
        </TableRow>
      </TableFooter>
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
    <TableRow positive>
      <TableCell>{statement.date}</TableCell>
      <TableCell>{statement.date}</TableCell>
      <TableCell textAlign="right">
        {debit > 0 ? <CurrencyDisplay amount={debit} /> : null}
      </TableCell>
      <TableCell textAlign="right">
        {credit > 0 ? <CurrencyDisplay amount={credit} /> : null}
      </TableCell>
    </TableRow>
  );
};

const LedgerRow = (props: {
  ledger: BalanceController.GetResp["ledgers"][number];
}) => {
  const { ledger } = props;
  return (
    <TableRow>
      <TableCell>{ledger.date}</TableCell>
      <TableCell>{ledger.brief}</TableCell>
      <TableCell textAlign="right">
        {ledger.debit > 0 ? <CurrencyDisplay amount={ledger.debit} /> : null}
      </TableCell>
      <TableCell textAlign="right">
        {ledger.credit > 0 ? <CurrencyDisplay amount={ledger.credit} /> : null}
      </TableCell>
    </TableRow>
  );
};
