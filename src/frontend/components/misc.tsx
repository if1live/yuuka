import { Anchor } from "@mantine/core";
import { Link } from "react-router-dom";

export const JournalLink = (props: {
  label?: string;
  id: string;
}) => {
  const { id, label } = props;
  const text = label ?? id;
  const url = `/journal/transaction/${id}`;
  return (
    <Anchor component={Link} to={url}>
      {text}
    </Anchor>
  );
};
