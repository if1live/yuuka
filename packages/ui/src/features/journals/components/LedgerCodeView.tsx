import { JournalEntry } from "@yuuka/api";

export const LedgerCodeView = (props: {
  entry: JournalEntry;
}) => {
  const { entry } = props;
  const text = JournalEntry.toLedger(entry);
  return <pre>{text}</pre>;
};
