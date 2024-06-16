import { Text } from "@mantine/core";

export const CurrencyDisplay = (props: {
  amount: number;
  currency: string;
  fw?: 500 | 700;
  ta?: "left" | "center" | "right";
}) => {
  const { amount, fw, currency } = props;
  const line = format_safe(amount, currency);
  const ta = props.ta ?? "right";
  return fw ? (
    <Text ta={ta} fw={fw}>
      {line}
    </Text>
  ) : (
    <Text ta={ta}>{line}</Text>
  );
};

const format_currency = (amount: number, currency: string) => {
  const formatter = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
  });

  const line = formatter.format(amount);
  return line;
};

const format_safe = (amount: number, currency: string) => {
  try {
    return format_currency(amount, currency);
  } catch (e) {
    // UI에서 텍스트로 입력하다보면 불완전한 currency 문자열이 입력된다.
    // RangeError: Invalid currency code : US 같은 형태로 터지지 않도록 땜빵
    const format = new Intl.NumberFormat();
    return `${currency} ${format.format(amount)}`;
  }
};
