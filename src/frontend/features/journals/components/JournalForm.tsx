import { ErrorMessage } from "@hookform/error-message";
import { Button, Group, Input, NativeSelect, Table } from "@mantine/core";
import * as csv from "csv/browser/esm/sync";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as R from "remeda";
import {
  Journal,
  type JournalLine,
  type JournalLine_Credit,
  type JournalLine_Debit,
} from "../../../../index.js";
import { MasterDataContext } from "../../../providers/MasterDataContext.js";
import { JournalList } from "./JournalList.js";

type Preset = {
  codes_debit: number[];
  codes_credit: number[];
};

const preset_네이버페이_식비: Preset = {
  codes_debit: [852000],
  codes_credit: [102111],
};

export const JournalForm = (props: {
  defaultValue: Journal;
  onSubmit: (entry: Journal) => Promise<void>;
}) => {
  const { onSubmit } = props;

  const masterdata = useContext(MasterDataContext);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Journal>({
    defaultValues: props.defaultValue,
  });

  const values = watch();
  const result = Journal.safeValidate(values);
  const valid = result.isOk && R.isEmpty(errors);

  // TODO: form이 바뀐걸 상위로 전달할 더 좋은 방법?

  const findUnusedCode = (): number => {
    const list_used = [...values.lines_debit, ...values.lines_credit].map(
      (x) => x.code,
    );
    const list_full = masterdata.accounts.map((x) => x.code);
    const list_candidate = R.differenceWith(
      list_full,
      list_used,
      R.isDeepEqual,
    );
    return list_candidate[0] ?? 101_000;
  };

  const addLine_debit = () => {
    const next: JournalLine_Debit = {
      _tag: "debit",
      code: findUnusedCode(),
      debit: 0,
    };

    const lines = [...values.lines_debit, next];
    setValue("lines_debit", lines);
  };

  const addLine_credit = () => {
    const next: JournalLine_Credit = {
      _tag: "credit",
      code: findUnusedCode(),
      credit: 0,
    };
    const lines_credit = [...values.lines_credit, next];
    setValue("lines_credit", lines_credit);
  };

  const swapLines = () => {
    const lines_debit = values.lines_credit.map(
      (x): JournalLine_Debit => ({
        _tag: "debit",
        code: x.code,
        debit: x.credit,
      }),
    );

    const lines_credit = values.lines_debit.map(
      (x): JournalLine_Credit => ({
        _tag: "credit",
        code: x.code,
        credit: x.debit,
      }),
    );

    setValue("lines_debit", lines_debit);
    setValue("lines_credit", lines_credit);
  };

  const resetLines = () => {
    // 날짜는 이어서 작성하고 싶다.
    setValue("brief", props.defaultValue.brief);
    setValue("lines_debit", props.defaultValue.lines_debit);
    setValue("lines_credit", props.defaultValue.lines_credit);
  };

  const removeLine_debit = (code: number) => {
    const lines_debit = values.lines_debit.filter((x) => x.code !== code);
    setValue("lines_debit", lines_debit);
  };

  const removeLine_credit = (code: number) => {
    const lines_credit = values.lines_credit.filter((x) => x.code !== code);
    setValue("lines_credit", lines_credit);
  };

  const displayCSV = (entry: Journal) => {
    const mat = Journal.toMat(entry);
    const text = csv.stringify(mat);
    return text;
  };

  const filterAvailableAccountCodes = (line: JournalLine) => {
    // code는 겹치면 안된다. 자신은 포함되어야한다
    const codes_used = [...values.lines_debit, ...values.lines_credit].map(
      (x) => x.code,
    );
    const accounts = masterdata.accounts.filter((x) => {
      if (x.code === line.code) return true;
      if (codes_used.includes(x.code)) return false;
      return true;
    });
    return accounts;
  };

  const setPreset = (preset: Preset) => {
    const lines_debit = preset.codes_debit.map(
      (code): JournalLine_Debit => ({ _tag: "debit", code, debit: 0 }),
    );

    const lines_credit = preset.codes_credit.map(
      (code): JournalLine_Credit => ({ _tag: "credit", code, credit: 0 }),
    );

    setValue("lines_debit", lines_debit);
    setValue("lines_credit", lines_credit);
    setValue("brief", "");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input.Wrapper label="date">
          <Input
            type="date"
            {...register("date", {
              onChange: (e) => {
                const value = e.target.value as string;
                const tokens = value.split("-");
                const y = Number.parseInt(tokens[0] as string, 10) - 2000;
                const m = tokens[1];
                const d = tokens[2];
                const id = `${y}${m}${d}_000000`;
                setValue("id", id);
              },
            })}
          />
        </Input.Wrapper>

        <Input.Wrapper label="id">
          <Input
            {...register("id", {
              required: "id is required",
            })}
          />
          <ErrorMessage
            errors={errors}
            name="id"
            render={({ message }) => <p>{message}</p>}
          />
        </Input.Wrapper>

        <Input.Wrapper label="brief">
          <Input
            {...register("brief", {
              required: "brief is required",
            })}
            autoComplete="off"
          />
          <ErrorMessage
            errors={errors}
            name="brief"
            render={({ message }) => <p>{message}</p>}
          />
        </Input.Wrapper>

        <Table color="blue">
          <DebitTableHeader />
          <Table.Tbody>
            {values.lines_debit.map((line, idx) => {
              const key = `${line._tag}-${line.code}`;
              const accounts = filterAvailableAccountCodes(line);

              return (
                <Table.Tr key={key}>
                  <Table.Td>
                    <NativeSelect
                      {...register(`lines_debit.${idx}.code`, {
                        valueAsNumber: true,
                      })}
                    >
                      {accounts.map((x) => (
                        <option key={x.code} value={x.code}>
                          [{x.code}] {x.name}
                        </option>
                      ))}
                    </NativeSelect>
                  </Table.Td>
                  <Table.Td>
                    <Input
                      type="number"
                      {...register(`lines_debit.${idx}.debit`, {
                        valueAsNumber: true,
                      })}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Button
                      onClick={() => removeLine_debit(line.code)}
                      variant="light"
                      color="red"
                    >
                      del
                    </Button>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>

        <Table color="red">
          <CreditTableHeader />
          <Table.Tbody>
            {values.lines_credit.map((line, idx) => {
              const key = `${line._tag}-${line.code}`;
              const accounts = filterAvailableAccountCodes(line);

              return (
                <Table.Tr key={key}>
                  <Table.Td>
                    <NativeSelect
                      {...register(`lines_credit.${idx}.code`, {
                        valueAsNumber: true,
                      })}
                    >
                      {accounts.map((x) => (
                        <option key={x.code} value={x.code}>
                          [{x.code}] {x.name}
                        </option>
                      ))}
                    </NativeSelect>
                  </Table.Td>
                  <Table.Td>
                    <Input
                      type="number"
                      {...register(`lines_credit.${idx}.credit`, {
                        valueAsNumber: true,
                      })}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Button
                      onClick={() => removeLine_credit(line.code)}
                      variant="light"
                      color="red"
                    >
                      del
                    </Button>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>

        <Input.Wrapper>
          <DebitCreditTableActions
            debit={addLine_debit}
            credit={addLine_credit}
            swap={swapLines}
            reset={resetLines}
          />
        </Input.Wrapper>

        <Button type="submit" disabled={!valid}>
          submit
        </Button>
      </form>

      <JournalList entries={[values]} />

      {/* 좀 무식한데 csv 접근을 열어둠 */}
      {valid ? <pre>{displayCSV(values)}</pre> : null}

      <h2>Presets</h2>
      <Group>
        <Button
          variant="default"
          onClick={() => setPreset(preset_네이버페이_식비)}
        >
          preset: 네이버페이로 식비
        </Button>
      </Group>
    </>
  );
};

const DebitTableHeader = () => (
  <Table.Thead>
    <Table.Tr>
      <Table.Th>code</Table.Th>
      <Table.Th>debit</Table.Th>
      <Table.Th>actions</Table.Th>
    </Table.Tr>
  </Table.Thead>
);

const CreditTableHeader = () => (
  <Table.Thead>
    <Table.Tr>
      <Table.Th>code</Table.Th>
      <Table.Th>credit</Table.Th>
      <Table.Th>actions</Table.Th>
    </Table.Tr>
  </Table.Thead>
);

const DebitCreditTableActions = (props: {
  debit: () => void;
  credit: () => void;
  swap: () => void;
  reset: () => void;
}) => (
  <Button.Group>
    <Button type="button" onClick={props.debit} variant="default">
      debit
    </Button>
    <Button type="button" onClick={props.credit} variant="default">
      credit
    </Button>
    <Button type="button" onClick={props.swap} variant="default">
      swap
    </Button>
    <Button type="button" onClick={props.reset} color="red">
      reset
    </Button>
  </Button.Group>
);
