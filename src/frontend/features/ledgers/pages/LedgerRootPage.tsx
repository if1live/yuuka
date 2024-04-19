import { Container, Input, Table } from "@mantine/core";
import { useContext, useState } from "react";
import * as R from "remeda";
import { Account, AccountCategory, DateOnly } from "../../../../index.js";
import { AccountLink } from "../../../components/index.js";
import { MasterDataContext } from "../../../providers/MasterDataContext.js";

// 장부 목록은 계정코드로 유도할수 있어서 http 요청이 필요 없다
export const LedgerRootPage = () => {
  const now = new Date();
  const date = R.pipe(DateOnly.fromDate(now), (x) =>
    DateOnly.setDayAsLastDayOfMonth(x),
  );
  return <LedgerRootView date={date} />;
};

const LedgerRootView = (props: {
  date: DateOnly;
}) => {
  const { accountGroups, accounts } = useContext(MasterDataContext);
  const [date, setInputDate] = useState(props.date);

  const groupMap = new Map(accountGroups.map((x) => [x.code, x]));
  const date_first = DateOnly.setDay(date, 1);

  return (
    <Container>
      <h2>date</h2>
      <form>
        <Input.Wrapper label="date">
          <Input
            type="date"
            value={date}
            onChange={(e) => setInputDate(e.target.value as DateOnly)}
          />
        </Input.Wrapper>
      </form>

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>대분류</Table.Th>
            <Table.Th>소분류</Table.Th>
            <Table.Th>계정코드</Table.Th>
            <Table.Th>
              계정과목: {date_first} ~ {date}
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {accounts.map((x) => {
            const groupCode = Account.toGroup(x.code);
            const tag = groupMap.get(groupCode);
            if (!tag) {
              throw new Error("tag not found");
            }

            const major = AccountCategory.toKorean(tag.major);
            const minor = tag.minor;

            // 상위 항목과 하위 항목을 구분해서 보여주고 싶다
            const isTagAccount = groupCode * 1000 === x.code;

            // TODO: 상위 분류에 따라서 구분해서 보여주고 싶다

            return (
              <Table.Tr key={x.code}>
                <Table.Td>{major}</Table.Td>
                <Table.Td>{minor}</Table.Td>
                <Table.Td>{isTagAccount ? groupCode : x.code}</Table.Td>
                <Table.Td>
                  <AccountLink code={x.code} date={date} />
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Container>
  );
};
