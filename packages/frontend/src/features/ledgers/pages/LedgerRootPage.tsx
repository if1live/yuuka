import { AccountCategory, AccountCode } from "@yuuka/core";
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
import { AccountCodeLink } from "../../../components";
import { MasterDataContext } from "../../../contexts/MasterDataContext";

// 장부 목록은 계정코드로 유도할수 있어서 http 요청이 필요 없다
export const LedgerRootPage = () => {
  const now = new Date();
  return <LedgerRootView now={now} />;
};

const convertDateToYMD = (date: Date): string => {
  return date.toISOString().split("T")[0] ?? "";
};

export const convertDateToRange = (
  date: Date,
): { startDate: string; endDate: string } => {
  const start = new Date(date);
  start.setDate(1);

  const end = new Date(date);
  end.setDate(1);
  end.setUTCMonth(end.getUTCMonth() + 1);

  return {
    startDate: convertDateToYMD(start),
    endDate: convertDateToYMD(end),
  };
};

const LedgerRootView = (props: {
  now: Date;
}) => {
  const { accountTags, accountCodes } = useContext(MasterDataContext);
  const { now } = props;

  const initial = convertDateToRange(now);
  const [startDate, setStartDate] = useState(initial.startDate);
  const [endDate, setEndDate] = useState(initial.endDate);

  const tagMap = new Map(accountTags.map((x) => [x.code, x]));

  const group = R.groupBy(accountCodes, (x) => AccountCode.toTag(x.code));

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
          {accountCodes.map((x) => {
            const tagCode = AccountCode.toTag(x.code);
            const tag = tagMap.get(tagCode);
            if (!tag) {
              throw new Error("tag not found");
            }

            const major = AccountCategory.toKorean(tag.major);
            const minor = tag.minor;

            // 상위 항목과 하위 항목을 구분해서 보여주고 싶다
            const isTagAccount = tagCode * 1000 === x.code;

            // TODO: 상위 분류에 따라서 구분해서 보여주고 싶다

            return (
              <Table.Row key={x.code}>
                <Table.Cell>{major}</Table.Cell>
                <Table.Cell>{minor}</Table.Cell>
                <Table.Cell>{isTagAccount ? tagCode : x.code}</Table.Cell>
                <Table.Cell>
                  <AccountCodeLink
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
