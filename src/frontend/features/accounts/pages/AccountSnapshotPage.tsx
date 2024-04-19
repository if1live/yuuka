import { Button, Container, Input, SegmentedControl } from "@mantine/core";
import { assertNonEmptyArray } from "@toss/assert";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as R from "remeda";
import useSWR from "swr";
import { Account } from "../../../../accounts/models/Account.js";
import { AccountApi } from "../../../../controllers/index.js";
import { AccountController } from "../../../../controllers/mod.js";
import { MasterDataContext } from "../../../providers/MasterDataContext.js";
import { AccountSnapshotTable } from "../components/AccountSnapshotTable.js";

export const AccountSnapshotPage = () => {
  const params = useParams();
  const req = AccountController.SnapshotReq.parse(params);
  const qs = new URLSearchParams();
  qs.append("date", `${req.date}`);

  const url = `${AccountApi.path}/snapshot?${qs}`;
  const { data, error, isLoading } = useSWR(url);
  const resp = data as AccountController.SnapshotResp;

  if (error) {
    return <div>failed to load</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  return <AccountSnapshotView req={req} resp={resp} />;
};

const AccountSnapshotView = (props: {
  req: AccountController.SnapshotReq;
  resp: AccountController.SnapshotResp;
}) => {
  const masterdata = useContext(MasterDataContext);
  const navigate = useNavigate();

  const { req, resp } = props;

  const defaultValues = {
    date: req.date,
  };
  type FieldValues = typeof defaultValues;

  const [value, setValue] = useState("group");
  const { register, handleSubmit } = useForm({
    defaultValues,
  });

  const onSubmit = (data: FieldValues) => {
    const url = `/account/snapshot/${data.date}`;
    navigate(url);
  };

  const balanceTable = new Map<number, number>();
  for (const x of resp) {
    balanceTable.set(x.code, x.balance);
  }

  const items_account = Account.zip(
    masterdata.accounts,
    masterdata.accountGroups,
  ).map((item) => {
    const balance = balanceTable.get(item.account.code);
    return {
      ...item,
      balance: balance ?? 0,
    };
  });

  const items_group = R.pipe(
    items_account,
    R.groupBy((x) => x.group.code),
    R.entries(),
    R.map((entry) => {
      const [_drop, items] = entry;
      assertNonEmptyArray(items);

      const first = items[0];
      const balance = R.sumBy(items, (x) => x.balance);
      return { ...first, balance };
    }),
  );

  return (
    <Container>
      <h1>account</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input.Wrapper label="date">
          <Input type="date" {...register("date")} />
        </Input.Wrapper>
        <Input.Wrapper>
          <Button type="submit">조회</Button>
        </Input.Wrapper>
      </form>

      <SegmentedControl
        data={["group", "account"] as const}
        value={value}
        onChange={setValue}
      />

      {value === "account" ? (
        <AccountSnapshotTable date={req.date} items={items_account} />
      ) : null}

      {value === "group" ? (
        <AccountSnapshotTable date={req.date} items={items_group} />
      ) : null}
    </Container>
  );
};
