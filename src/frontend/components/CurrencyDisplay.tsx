export const CurrencyDisplay = (props: {
  amount: number;
}) => {
  const { amount } = props;
  const formatter = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  });
  return <span>{formatter.format(amount)}</span>;
};
