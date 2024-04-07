import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Form,
  FormField,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import type { AccountGroup, DateText } from "../../../../index.js";
import { Account, AccountCategory } from "../../../../index.js";
import { CurrencyDisplay } from "../../../components/CurrencyDisplay.js";
import { convertDateToYMD } from "../../../helpers/index.js";
import { MasterDataContext } from "../../../providers/MasterDataContext.js";

export const BalanceRootPage = () => {
  const masterdata = useContext(MasterDataContext);

  // TODO: 날짜를 조정해서 특정날로 돌리는 기능이 있으면 재밌을거같은데
  // 기본적으로는 오늘 기준으로 잔액만 있으면 되고
  // TODO: view/page 나누기
  const now = new Date();
  const initial = convertDateToYMD(now) as DateText;
  const [inputDate, setInputDate] = useState<DateText>(initial);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [resp, setResp] = useState<object | null>(null);
  const [date, setDate] = useState<DateText>("1970-01-01");

  // 잔액은 고정된 상태를 표현하니까 statement로 연결할수 있는것만
  const items = Account.zip(masterdata.accounts, masterdata.accountGroups);
  const items_asset = items.filter((x) => x.group.major === "asset");
  const items_equity = items.filter((x) => x.group.major === "equity");
  const items_liability = items.filter((x) => x.group.major === "liability");

  // TODO: statement, ledger로 잔액 유도
  // 얼마 있는지 한번에 볼수 있는 기능이 있으면 좋겠다

  const handleRefresh = async () => {
    setLoading(true);
    setResp(null);
    setError(null);

    try {
      // TODO: request?
      setDate(inputDate);

      setResp({});
    } catch (e) {
      setError(e as Error);
    }

    setLoading(false);
  };

  return (
    <>
      <h1>balance</h1>

      <h2>date</h2>
      <Form>
        <FormField>
          <label>date</label>
          <input
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value as DateText)}
          />
        </FormField>

        <Button type="button" loading={loading} onClick={handleRefresh}>
          refresh
        </Button>
      </Form>

      {items_asset.length ? (
        <BalanceTable items={items_asset} date={date} />
      ) : null}

      {items_equity.length ? (
        <BalanceTable items={items_equity} date={date} />
      ) : null}

      {items_liability.length ? (
        <BalanceTable items={items_liability} date={date} />
      ) : null}
    </>
  );
};

const BalanceTable = (props: {
  items: { account: Account; group: AccountGroup }[];
  date: DateText;
}) => {
  const { items, date } = props;
  return (
    <Table celled compact="very" selectable attached>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>대분류</TableHeaderCell>
          <TableHeaderCell>소분류</TableHeaderCell>
          <TableHeaderCell>계정코드</TableHeaderCell>
          <TableHeaderCell>이름</TableHeaderCell>
          <TableHeaderCell>잔액: {date}</TableHeaderCell>
        </TableRow>
      </TableHeader>

      <TableBody>
        {items.map(({ account, group }) => {
          const major = AccountCategory.toKorean(group.major);
          const minor = group.minor;
          const url = `/balance/${account.code}/${date}`;

          return (
            <TableRow key={account.code}>
              <TableCell>{major}</TableCell>
              <TableCell>{minor}</TableCell>
              <TableCell>{account.code}</TableCell>
              <TableCell>
                <Link to={url}>{account.name}</Link>
              </TableCell>
              <TableCell>
                <CurrencyDisplay amount={-1} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
