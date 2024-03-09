import { JournalEntry } from "@yuuka/core";
import { TableCell, TableRow } from "semantic-ui-react";
import {
  AccountCodeLink,
  CurrencyDisplay,
  JournalEntryLink,
} from "../../../components";

export const JournalEntryBlock = (props: {
  entry: JournalEntry;
  order: number;
}) => {
  const { entry } = props;

  return entry.lines.map((line, idx) => {
    const key = `${entry.id}-${line.code}`;

    // 상세정보를 첫줄에만 쓰고 싶어서
    // 올바른 journal entry는 적어도 2개의 행을 갖는다
    const isFirstRow = idx === 0;
    const isSecondRow = idx === 1;

    const debit = line._tag === "debit" ? line.debit : null;
    const credit = line._tag === "credit" ? line.credit : null;

    // 검증 상세 정보
    const result = JournalEntry.safeValidate(entry);
    const error = result.isErr() ? (result.error as Error) : null;

    return (
      <TableRow key={key} error={result.isErr()}>
        <TableCell>
          {isFirstRow ? entry.date : null}
          {isSecondRow ? <JournalEntryLink id={entry.id} /> : null}
        </TableCell>

        <TableCell>
          {isFirstRow ? entry.brief : null}
          {isSecondRow && error ? error.message : null}
        </TableCell>

        <TableCell>
          <AccountCodeLink code={line.code} />
        </TableCell>

        <TableCell textAlign="right">
          {debit ? <CurrencyDisplay amount={debit} /> : null}
        </TableCell>

        <TableCell textAlign="right">
          {credit ? <CurrencyDisplay amount={credit} /> : null}
        </TableCell>
      </TableRow>
    );
  });
};
