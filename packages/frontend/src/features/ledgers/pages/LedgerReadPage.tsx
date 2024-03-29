import { ledgerSpecification } from "@yuuka/core";
import { useParams } from "react-router-dom";
import * as R from "remeda";
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import useSWR from "swr";
import {
  AccountCodeLink,
  CurrencyDisplay,
  JournalEntryLink,
} from "../../../components";

export const LedgerReadPage = () => {
  const sheet = ledgerSpecification.dataSheet;
  const spec = sheet.list;

  const params = useParams();
  const req = spec.schema.req.parse(params);
  const qs = new URLSearchParams();
  qs.append("code", `${req.code}`);

  const url = `${ledgerSpecification.resource}${spec.endpoint.path}?${qs}`;
  const { data, error, isLoading } = useSWR(url);
  const resp = data as (typeof spec)["inout"]["_out"];

  if (error) {
    return <div>failed to load</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  return <LedgerReadView req={req} resp={resp} />;
};

type Ledger = {
  id: string;
  brief: string;
  date: string;

  // 귀찮아서 union 분리는 안함
  debit: number;
  credit: number;
};

const LedgerReadView = (props: {
  req: (typeof ledgerSpecification.dataSheet.list)["inout"]["_in"];
  resp: (typeof ledgerSpecification.dataSheet.list)["inout"]["_out"];
}) => {
  const { req, resp } = props;

  const { code } = req;
  const { ledgers } = resp;

  const ledgers_debit: Ledger[] = [];
  const ledgers_credit: Ledger[] = [];

  for (const ledger of ledgers) {
    if (ledger.debit > 0) {
      ledgers_debit.push(ledger);
    }
    if (ledger.credit > 0) {
      ledgers_credit.push(ledger);
    }
  }

  // 장부에서는 차변, 대변을 한쌍을 맞춰서 그리고 싶다
  type Row = {
    debit: Ledger | undefined;
    credit: Ledger | undefined;
  };

  const rows: Row[] = [];

  const loopcount = Math.max(ledgers_debit.length, ledgers_credit.length);
  for (let i = 0; i < loopcount; i++) {
    const ledger_debit = ledgers_debit[i];
    const ledger_credit = ledgers_credit[i];
    rows.push({
      debit: ledger_debit,
      credit: ledger_credit,
    });
  }

  const sum_debit = R.sumBy(ledgers_debit, (x) => x.debit);
  const sum_credit = R.sumBy(ledgers_credit, (x) => x.credit);

  return (
    <>
      <h1>
        <AccountCodeLink code={code} />
      </h1>

      <Table selectable celled compact="very" unstackable>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>일자</TableHeaderCell>
            <TableHeaderCell>적요</TableHeaderCell>
            <TableHeaderCell>금액</TableHeaderCell>
            <TableHeaderCell>일자</TableHeaderCell>
            <TableHeaderCell>적요</TableHeaderCell>
            <TableHeaderCell>금액</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row, i) => {
            const { debit, credit } = row;

            const prev = rows[i - 1];
            const key = [debit?.id, credit?.id].join("-");

            return (
              <TableRow key={key}>
                <LedgerBlock ledger={debit} prev={prev?.debit} />
                <LedgerBlock ledger={credit} prev={prev?.credit} />
              </TableRow>
            );
          })}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableHeaderCell> </TableHeaderCell>
            <TableHeaderCell> </TableHeaderCell>
            <TableHeaderCell textAlign="right">
              <CurrencyDisplay amount={sum_debit} />
            </TableHeaderCell>
            <TableHeaderCell> </TableHeaderCell>
            <TableHeaderCell> </TableHeaderCell>
            <TableHeaderCell textAlign="right">
              <CurrencyDisplay amount={sum_credit} />
            </TableHeaderCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
};

const LedgerBlock = (props: {
  ledger: Ledger | undefined;
  prev: Ledger | undefined;
}) => {
  const { ledger, prev } = props;
  return ledger ? (
    <LedgerBlock_Exists ledger={ledger} prev={prev} />
  ) : (
    <LedgerBlock_None />
  );
};

const LedgerBlock_None = () => {
  return (
    <>
      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
    </>
  );
};

// TODO: compound entry는 어떻게 표현하지?
const LedgerBlock_Exists = (props: {
  ledger: Ledger;
  prev: Ledger | undefined;
}) => {
  const { ledger, prev } = props;

  const amount = ledger.credit > 0 ? ledger.credit : ledger.debit;
  const displayDate = ledger.date !== prev?.date;
  return (
    <>
      <Table.Cell>{displayDate ? ledger.date : null}</Table.Cell>
      <Table.Cell>
        <JournalEntryLink id={ledger.id} label={ledger.brief} />
      </Table.Cell>
      <Table.Cell textAlign="right">
        <CurrencyDisplay amount={amount} />
      </Table.Cell>
    </>
  );
};
