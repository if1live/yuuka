import { Text } from "@mantine/core";

export const CurrencyDisplay = (props: {
  amount: number;
  fw?: 500 | 700;
  ta?: "left" | "center" | "right";
}) => {
  const { amount, fw } = props;
  const formatter = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  });

  const ta = props.ta ?? "right";

  const line = formatter.format(amount);
  return fw ? (
    <Text ta={ta} fw={fw}>
      {line}
    </Text>
  ) : (
    <Text ta={ta}>{line}</Text>
  );
};
