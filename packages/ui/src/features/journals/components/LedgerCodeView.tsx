import { Button } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { JournalEntry } from "@yuuka/api";

export const LedgerCodeView = (props: {
  entry: JournalEntry;
}) => {
  const { entry } = props;

  const clipboard = useClipboard({ timeout: 500 });
  const text = JournalEntry.toLedger(entry);

  return (
    <>
      <pre>{text}</pre>

      <Button
        color={clipboard.copied ? "teal" : "blue"}
        onClick={() => clipboard.copy(text)}
      >
        {clipboard.copied ? "Copied" : "Copy"}
      </Button>
    </>
  );
};
