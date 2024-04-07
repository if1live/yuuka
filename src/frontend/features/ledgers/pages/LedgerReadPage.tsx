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
import { LedgerApi, LedgerController } from "../../../../index.js";
import {
  AccountLink,
  CurrencyDisplay,
  JournalLink,
} from "../../../components/index.js";

export const LedgerReadPage = () => {
  const params = useParams();
  const req = LedgerController.ListReq.parse(params);
  const qs = new URLSearchParams();
  qs.append("code", `${req.code}`);
  qs.append("startDate", `${req.startDate}`);
  qs.append("endDate", `${req.endDate}`);

  const url = `${LedgerApi.path}/list?${qs}`;
  const { data, error, isLoading } = useSWR(url);
  const resp = data as LedgerController.ListResp;

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
  req: LedgerController.ListReq;
  resp: LedgerController.ListResp;
}) => {
  const { req, resp } = props;

  const { code, startDate, endDate } = req;
  const { statement, ledgers } = resp;

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

  const initial_skel: Ledger = {
    id: "",
    brief: "TODO_시작",
    date: startDate,
    debit: 0,
    credit: 0,
  };

  // TODO: 시작금액 기록을 더 멀쩡하게 만들어야한다.
  // TODO: account tag 보고 기록하기. 비용은 initial 항목이 없어야한다!
  const initial_debit: Ledger = {
    ...initial_skel,
    debit: statement.totalDebit + statement.closingBalance,
  };
  const initial_credit: Ledger = {
    ...initial_skel,
    credit: statement.totalCredit,
  };

  // 기초자산을 끼워넣는게 맞나?
  const sum_debit = R.sumBy([initial_debit, ...ledgers_debit], (x) => x.debit);
  const sum_credit = R.sumBy(
    [initial_credit, ...ledgers_credit],
    (x) => x.credit,
  );

  return (
    <>
      <h1>
        <AccountLink code={code} startDate={startDate} endDate={endDate} />
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
          <TableRow>
            <LedgerBlock ledger={initial_debit} prev={undefined} />
            <LedgerBlock ledger={initial_credit} prev={undefined} />
          </TableRow>
          {rows.map((row, i) => {
            const { debit, credit } = row;

            const prev = rows[i - 1];
            const key = `${debit?.id ?? ""}-${credit?.id ?? ""}-${i}`;

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
          <TableRow>
            <TableHeaderCell> </TableHeaderCell>
            <TableHeaderCell>debit - credit</TableHeaderCell>
            <TableHeaderCell textAlign="right">
              <CurrencyDisplay amount={sum_debit - sum_credit} />
            </TableHeaderCell>
            <TableHeaderCell> </TableHeaderCell>
            <TableHeaderCell>credit - debit</TableHeaderCell>
            <TableHeaderCell textAlign="right">
              <CurrencyDisplay amount={sum_credit - sum_debit} />
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
        <JournalLink id={ledger.id} label={ledger.brief} />
      </Table.Cell>
      <Table.Cell textAlign="right">
        <CurrencyDisplay amount={amount} />
      </Table.Cell>
    </>
  );
};
