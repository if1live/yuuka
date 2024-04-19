import { Button, Input, NativeSelect, Select } from "@mantine/core";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { DateOnly, LedgerApi, LedgerController } from "../../../../index.js";
import { AccountLink } from "../../../components/index.js";
import { createLedgerLink } from "../../../components/links.js";
import { MasterDataContext } from "../../../providers/MasterDataContext.js";
import { LedgerTable } from "../components/LedgerTable.js";

export const LedgerReadPage = () => {
  const params = useParams();
  const date = DateOnly.schema.parse(params.date);

  // 잔액계산하려면 1일부터 필요하다
  const date_start = DateOnly.setDay(date, 1);
  const req = LedgerController.ListReq.parse({
    code: Number(params.code),
    startDate: date_start,
    endDate: date,
  });
  const qs = new URLSearchParams();
  qs.append("code", `${req.code}`);
  qs.append("startDate", `${req.startDate}`);
  qs.append("endDate", `${req.endDate}`);

  const url = `${LedgerApi.path}/list?${qs}`;
  const { data, error, isLoading } = useSWR(url);
  const resp = data as LedgerController.ListResp;

  if (error) {
    return <div>failed to load</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  return <LedgerReadView req={req} resp={resp} />;
};

const LedgerReadView = (props: {
  req: LedgerController.ListReq;
  resp: LedgerController.ListResp;
}) => {
  const { req, resp } = props;

  const navigate = useNavigate();
  const masterdata = useContext(MasterDataContext);

  const accounts = masterdata.accounts;
  const { code, startDate, endDate } = req;
  const { lines } = resp;

  const defaultValues = {
    code,
    date: endDate,
  } as const;
  type FieldValues = typeof defaultValues;

  const { register, handleSubmit } = useForm({
    defaultValues,
  });

  const onSubmit = (v: FieldValues) => {
    const url = createLedgerLink(v);
    navigate(url);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input.Wrapper label="code">
          <NativeSelect
            {...register("code", {
              valueAsNumber: true,
            })}
          >
            {accounts.map((x) => (
              <option key={x.code} value={x.code}>
                [{x.code}] {x.name}
              </option>
            ))}
          </NativeSelect>
        </Input.Wrapper>

        <Input.Wrapper label="월">
          <Input type="date" {...register("date")} />
        </Input.Wrapper>

        <Input.Wrapper>
          <Button type="submit">조회</Button>
        </Input.Wrapper>
      </form>

      <h1>
        <AccountLink code={code} date={endDate} />
      </h1>

      <LedgerTable lines={lines} />
    </>
  );
};
