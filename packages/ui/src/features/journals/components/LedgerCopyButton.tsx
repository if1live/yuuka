import {
  Button,
  type ButtonProps,
  type FactoryPayload,
  type StylesApiProps,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { JournalEntry } from "@yuuka/api";

export const LedgerCopyButton = (props: {
  entry: JournalEntry;
  variant?: StylesApiProps<FactoryPayload>["variant"];
  size?: ButtonProps["size"];
}) => {
  const { entry } = props;

  const clipboard = useClipboard({ timeout: 500 });
  const text = JournalEntry.toLedger(entry);

  return (
    <Button
      color={clipboard.copied ? "teal" : "blue"}
      variant={props.variant}
      size={props.size}
      onClick={() => clipboard.copy(text)}
    >
      {clipboard.copied ? "copied" : "copy"}
    </Button>
  );
};
