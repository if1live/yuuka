import { Container, Table } from "@mantine/core";
import { useParams } from "react-router-dom";
import * as R from "remeda";
import useSWR from "swr";
import { BalanceApi } from "../../../../controllers/index.js";
import { BalanceController } from "../../../../controllers/mod.js";
import { CurrencyDisplay } from "../../../components/CurrencyDisplay.js";
import { AccountLink } from "../../../components/misc.js";

export const TrialBalancePage = () => {
  const params = useParams();
  const req = BalanceController.TrialBalanceReq.parse(params);
  const url = `${BalanceApi.path}/trial-balance/${req.date}`;
  const { data, error, isLoading } = useSWR(url);
  const resp = data as BalanceController.TrialBalanceResp;

  if (error) {
    return <div>failed to load</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  return <TrialBalanceView req={req} resp={resp} />;
};

const TrialBalanceView = (props: {
  req: BalanceController.TrialBalanceReq;
  resp: BalanceController.TrialBalanceResp;
}) => {
  const { req, resp } = props;
  return (
    <Container size="md">
      <TrialBalanceTable list={resp} />
    </Container>
  );
};

const TrialBalanceTable = (props: {
  list: BalanceController.TrialBalanceResp;
}) => {
  const { list } = props;
  const debit_sum = R.sumBy(list, (x) => x.debit_sum);
  const credit_sum = R.sumBy(list, (x) => x.credit_sum);
  const debit_balance = R.sumBy(list, (x) => x.debit_balance);
  const credit_balance = R.sumBy(list, (x) => x.credit_balance);

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>차변 잔액</Table.Th>
          <Table.Th>차변 합계</Table.Th>
          <Table.Th>계정과목</Table.Th>
          <Table.Th>대변 합계</Table.Th>
          <Table.Th>대변 잔액</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {list.map((item) => {
          return (
            <Table.Tr key={item.code}>
              <Table.Td>
                {item.debit_balance ? (
                  <CurrencyDisplay amount={item.debit_balance} />
                ) : null}
              </Table.Td>
              <Table.Td>
                {item.debit_sum ? (
                  <CurrencyDisplay amount={item.debit_sum} />
                ) : null}
              </Table.Td>
              <Table.Td>
                <AccountLink code={item.code} />
              </Table.Td>
              <Table.Td>
                {item.credit_sum ? (
                  <CurrencyDisplay amount={item.credit_sum} />
                ) : null}
              </Table.Td>
              <Table.Td>
                {item.credit_balance ? (
                  <CurrencyDisplay amount={item.credit_balance} />
                ) : null}
              </Table.Td>
            </Table.Tr>
          );
        })}

        <Table.Tr>
          <Table.Td>
            <CurrencyDisplay amount={debit_balance} />
          </Table.Td>
          <Table.Td>
            <CurrencyDisplay amount={debit_sum} />
          </Table.Td>
          <Table.Td>합계</Table.Td>
          <Table.Td>
            <CurrencyDisplay amount={credit_sum} />
          </Table.Td>
          <Table.Td>
            <CurrencyDisplay amount={credit_balance} />
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
};
