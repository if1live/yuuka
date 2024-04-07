import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import * as R from "remeda";
import {
  Form,
  FormField,
  Table,
  TableBody,
  TableHeader,
} from "semantic-ui-react";
import { Account, AccountCategory } from "../../../../index.js";
import { AccountLink } from "../../../components/index.js";
import { convertDateToRange } from "../../../helpers/index.js";
import { MasterDataContext } from "../../../providers/MasterDataContext.js";

// 장부 목록은 계정코드로 유도할수 있어서 http 요청이 필요 없다
export const LedgerRootPage = () => {
  const now = new Date();
  return <LedgerRootView now={now} />;
};

const LedgerRootView = (props: {
  now: Date;
}) => {
  const { accountGroups, accounts } = useContext(MasterDataContext);
  const { now } = props;

  const initial = convertDateToRange(now);
  const [startDate, setStartDate] = useState(initial.startDate);
  const [endDate, setEndDate] = useState(initial.endDate);

  const groupMap = new Map(accountGroups.map((x) => [x.code, x]));

  const group = R.groupBy(accounts, (x) => Account.toGroup(x.code));

  return (
    <>
      <h2>date range</h2>
      <Form>
        <FormField>
          <label>start date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </FormField>

        <FormField>
          <label>end date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </FormField>
      </Form>

      <Table selectable compact="very">
        <TableHeader>
          <Table.Row>
            <Table.HeaderCell>대분류</Table.HeaderCell>
            <Table.HeaderCell>소분류</Table.HeaderCell>
            <Table.HeaderCell>계정코드</Table.HeaderCell>
            <Table.HeaderCell>
              계정과목: {startDate} ~ {endDate}
            </Table.HeaderCell>
          </Table.Row>
        </TableHeader>

        <TableBody>
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
              <Table.Row key={x.code}>
                <Table.Cell>{major}</Table.Cell>
                <Table.Cell>{minor}</Table.Cell>
                <Table.Cell>{isTagAccount ? groupCode : x.code}</Table.Cell>
                <Table.Cell>
                  <AccountLink
                    code={x.code}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
