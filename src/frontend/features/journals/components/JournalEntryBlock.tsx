import type { JournalEntry } from "../../../../ledgers/JournalEntry.js";
import { JournalLineRow } from "./JournalLineRow.js";

/** 하나의 journal entry는 여러개의 line을 갖는다 */
export const JournalEntryBlock = (props: {
  entry: JournalEntry;
  order: number;
}) => {
  const { entry } = props;

  const lines_debit = entry.lines_debit.map((line, idx) => {
    const key = `${entry.id}-debit-${line.account}`;

    return (
      <JournalLineRow
        key={key}
        account={line.account}
        debit={line.debit}
        commodity={line.commodity}
      />
    );
  });

  const lines_credit = entry.lines_credit.map((line, idx) => {
    const key = `${entry.id}-debit-${line.account}`;

    return (
      <JournalLineRow
        key={key}
        account={line.account}
        credit={line.credit}
        commodity={line.commodity}
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
