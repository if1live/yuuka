import { Text } from "@mantine/core";

export const CurrencyDisplay = (props: {
  amount: number;
  fw?: 500 | 700;
}) => {
  const { amount, fw } = props;
  const formatter = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  });

  const line = formatter.format(amount);
  return fw ? (
    <Text ta="right" fw={fw}>
      {line}
    </Text>
  ) : (
    <Text ta="right">{line}</Text>
  );
};
