import { JournalEntry } from "@yuuka/core";
import { TableCell, TableRow } from "semantic-ui-react";
import {
  AccountCodeLink,
  CurrencyDisplay,
  JournalEntryLink,
} from "../../../components";

export const JournalEntryBlock = (props: {
  entry: JournalEntry;
  prev: JournalEntry | undefined;
  order: number;
}) => {
  const { entry, prev } = props;

  return entry.lines.map((line, idx) => {
    const key = `${entry.id}-${line.code}`;

    // 상세정보를 첫줄에만 쓰고 싶어서
    // 올바른 journal entry는 적어도 2개의 행을 갖는다
    const isFirstRow = idx === 0;
    const isSecondRow = idx === 1;
    const isLastRow = idx === entry.lines.length - 1;

    const debit = line._tag === "debit" ? line.debit : null;
    const credit = line._tag === "credit" ? line.credit : null;

    const displayDate = isFirstRow && prev?.date !== entry.date;

    // 검증 상세 정보
    const result = JournalEntry.safeValidate(entry);
    const error = result.isErr() ? (result.error as Error) : null;

    // journal entry의 경계선을 긋고싶다
    const cellClassName = isLastRow ? "last-row" : undefined;

    // TODO: 더 멀쩡한 css 작성 방식이 필요
    // 경계선이 어디까지 필요하지?
    const style = isLastRow ? { borderBottom: "1px solid #ccc" } : undefined;

    return (
      <TableRow key={key} error={result.isErr()}>
        <TableCell>{displayDate ? entry.date : null}</TableCell>

        <TableCell className={cellClassName} style={style}>
          {isFirstRow ? (
            <JournalEntryLink id={entry.id} label={entry.brief} />
          ) : null}
          {isSecondRow && error ? error.message : null}
        </TableCell>

        <TableCell className={cellClassName} style={style}>
          <AccountCodeLink code={line.code} />
        </TableCell>

        <TableCell className={cellClassName} style={style} textAlign="right">
          {debit ? <CurrencyDisplay amount={debit} /> : null}
        </TableCell>

        <TableCell className={cellClassName} style={style} textAlign="right">
          {credit ? <CurrencyDisplay amount={credit} /> : null}
        </TableCell>
      </TableRow>
    );
  });
};
