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
  const debit_total = R.sumBy(list, (x) => x.debit_sum);
  const credit_total = R.sumBy(list, (x) => x.credit_sum);

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
            <Table.Tr>
              <Table.Td> </Table.Td>
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
              <Table.Td> </Table.Td>
            </Table.Tr>
          );
        })}

        <Table.Tr>
          <Table.Td>TODO</Table.Td>
          <Table.Td>
            <CurrencyDisplay amount={debit_total} />
          </Table.Td>
          <Table.Td>합계</Table.Td>
          <Table.Td>
            <CurrencyDisplay amount={credit_total} />
          </Table.Td>
          <Table.Td>TODO</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
};
