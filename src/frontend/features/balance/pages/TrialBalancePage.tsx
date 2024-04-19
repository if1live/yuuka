import { Button, Container, Input } from "@mantine/core";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { BalanceApi } from "../../../../controllers/index.js";
import { BalanceController } from "../../../../controllers/mod.js";
import { TrialBalanceReport } from "../components/TrialBalanceReport.js";

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

  const navigate = useNavigate();

  const defaultValues = {
    date: resp.date_first,
  } as const;
  type FieldValues = typeof defaultValues;

  const { register, handleSubmit } = useForm({
    defaultValues,
  });

  const onSubmit = (data: FieldValues) => {
    const nextUrl = `/balance/trial-balance/${data.date}`;
    navigate(nextUrl);
  };

  return (
    <Container size="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input.Wrapper label="월">
          <Input type="date" {...register("date")} />
        </Input.Wrapper>
        <Input.Wrapper>
          <Button type="submit">조회</Button>
        </Input.Wrapper>
      </form>

      <TrialBalanceReport resp={resp} />
    </Container>
  );
};
