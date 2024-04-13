import { Table, Text } from "@mantine/core";
import { Journal } from "../../../../journals/models/Journal.js";
import {
  AccountLink,
  CurrencyDisplay,
  JournalLink,
} from "../../../components/index.js";

export const JournalBlock = (props: {
  entry: Journal;
  prev: Journal | undefined;
  order: number;
}) => {
  const { entry, prev } = props;

  const lines_debit = entry.lines_debit.map((line, idx) => {
    const key = `${entry.id}-debit-${line.code}`;

    // 상세정보를 첫줄에만 쓰고 싶어서
    const lineIndex = idx;
    const displayDate = idx === 0 && prev?.date !== entry.date;

    return (
      <JournalLineRow
        key={key}
        entry={entry}
        lineIndex={lineIndex}
        code={line.code}
        displayDate={displayDate}
        debit={line.debit}
      />
    );
  });

  const lines_credit = entry.lines_credit.map((line, idx) => {
    const key = `${entry.id}-debit-${line.code}`;
    const displayDate = false;
    const lineIndex = lines_debit.length + idx;

    return (
      <JournalLineRow
        key={key}
        entry={entry}
        lineIndex={lineIndex}
        code={line.code}
        displayDate={displayDate}
        credit={line.credit}
      />
    );
  });

  return (
    <>
      {...lines_debit}
      {...lines_credit}
    </>
  );
};

const JournalLineRow = (props: {
  entry: Journal;
  lineIndex: number;
  code: number;
  displayDate: boolean;
  debit?: number;
  credit?: number;
}) => {
  const { code, entry, lineIndex, displayDate, debit, credit } = props;

  // 검증 상세 정보
  const result = Journal.safeValidate(entry);
  const error = result.isErr ? (result.error as Error) : null;

  // 상세정보를 첫줄에만 쓰고 싶어서
  const isFirstRow = lineIndex === 0;
  const isSecondRow = lineIndex === 1;

  // journal entry의 경계선을 긋고싶다
  const totalLineCount = entry.lines_debit.length + entry.lines_credit.length;
  const isLastRow = lineIndex === totalLineCount - 1;

  const cellClassName = isLastRow ? "last-row" : undefined;
  const style = isLastRow ? { borderBottom: "1px solid #ccc" } : undefined;
  const isError = Boolean(error);

  return (
    <Table.Tr>
      <Table.Td>{displayDate ? <Text>{entry.date}</Text> : null}</Table.Td>

      <Table.Td>
        {isFirstRow ? <JournalLink id={entry.id} label={entry.brief} /> : null}
        {isSecondRow && error ? error.message : null}
      </Table.Td>

      <Table.Td>
        <AccountLink code={code} />
      </Table.Td>

      <Table.Td>{debit ? <CurrencyDisplay amount={debit} /> : null}</Table.Td>

      <Table.Td>{credit ? <CurrencyDisplay amount={credit} /> : null}</Table.Td>
    </Table.Tr>
  );
};
