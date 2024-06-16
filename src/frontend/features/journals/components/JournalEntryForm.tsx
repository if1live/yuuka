import { ErrorMessage } from "@hookform/error-message";
import {
  Button,
  Group,
  Input,
  InputWrapper,
  NativeSelect,
  Table,
} from "@mantine/core";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as R from "remeda";
import { JournalEntry } from "../../../../ledgers/JournalEntry.js";
import type {
  JournalLine,
  JournalLine_Credit,
  JournalLine_Debit,
} from "../../../../ledgers/JournalLine.js";
import { masterdata_preset } from "../../../hardcoding.js";
import { MasterDataContext } from "../../../providers/MasterDataContext.js";
import { JournalEntryList } from "./JournalEntryList.js";

type Preset = {
  accounts_debit: string[];
  accounts_credit: string[];
};
const presets = masterdata_preset;

export const JournalEntryForm = (props: {
  defaultValue: JournalEntry;
  onSubmit: (entry: JournalEntry) => Promise<void>;
}) => {
  const { onSubmit } = props;

  const masterdata = useContext(MasterDataContext);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<JournalEntry>({
    defaultValues: props.defaultValue,
  });

  const values = watch();
  const result = JournalEntry.safeValidate(values);
  const valid = result.isOk && R.isEmpty(errors);

  // TODO: form이 바뀐걸 상위로 전달할 더 좋은 방법?

  const findUnusedAccount = (): string => {
    const list_used = [...values.lines_debit, ...values.lines_credit].map(
      (x) => x.account,
    );
    const list_full = masterdata.accounts.map((x) => x.name);
    const list_candidate = R.differenceWith(
      list_full,
      list_used,
      R.isDeepEqual,
    );
    return list_candidate[0] ?? "101_000";
  };

  const addLine_debit = () => {
    const next: JournalLine_Debit = {
      _tag: "debit",
      account: findUnusedAccount(),
      debit: 0,
      commodity: "KRW",
    };

    const lines = [...values.lines_debit, next];
    setValue("lines_debit", lines);
  };

  const addLine_credit = () => {
    const next: JournalLine_Credit = {
      _tag: "credit",
      account: findUnusedAccount(),
      credit: 0,
      commodity: "KRW",
    };
    const lines_credit = [...values.lines_credit, next];
    setValue("lines_credit", lines_credit);
  };

  const swapLines = () => {
    const lines_debit = values.lines_credit.map(
      (x): JournalLine_Debit => ({
        _tag: "debit",
        account: x.account,
        debit: x.credit,
        commodity: "KRW",
      }),
    );

    const lines_credit = values.lines_debit.map(
      (x): JournalLine_Credit => ({
        _tag: "credit",
        account: x.account,
        credit: x.debit,
        commodity: "KRW",
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

  const removeLine_debit = (account: string) => {
    const lines_debit = values.lines_debit.filter((x) => x.account !== account);
    setValue("lines_debit", lines_debit);
  };

  const removeLine_credit = (account: string) => {
    const lines_credit = values.lines_credit.filter(
      (x) => x.account !== account,
    );
    setValue("lines_credit", lines_credit);
  };

  const displayLedger = (entry: JournalEntry) => {
    return "TODO";
  };

  const filterAvailableAccounts = (line: JournalLine) => {
    // account는 겹치면 안된다. 자신은 포함되어야한다
    const accounts_used = [...values.lines_debit, ...values.lines_credit].map(
      (x) => x.account,
    );
    const accounts = masterdata.accounts.filter((x) => {
      if (x.name === line.account) return true;
      if (accounts_used.includes(x.name)) return false;
      return true;
    });
    return accounts;
  };

  const setPreset = (preset: Preset) => {
    const lines_debit = preset.accounts_debit.map(
      (account): JournalLine_Debit => ({
        _tag: "debit",
        account,
        debit: 0,
        commodity: "KRW",
      }),
    );

    const lines_credit = preset.accounts_credit.map(
      (account): JournalLine_Credit => ({
        _tag: "credit",
        account,
        credit: 0,
        commodity: "KRW",
      }),
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

        <h3>debit</h3>
        {values.lines_debit.map((line, idx) => {
          const key = `${line._tag}-${line.account}`;
          const accounts = filterAvailableAccounts(line);

          return (
            <div key={key}>
              <Input.Wrapper label="account">
                <NativeSelect {...register(`lines_debit.${idx}.account`)}>
                  {accounts.map((x) => (
                    <option key={x.name} value={x.name}>
                      {x.name}
                    </option>
                  ))}
                </NativeSelect>
              </Input.Wrapper>

              <Input.Wrapper label="debit">
                <Input
                  type="number"
                  {...register(`lines_debit.${idx}.debit`, {
                    valueAsNumber: true,
                  })}
                />
              </Input.Wrapper>

              <Input.Wrapper label="commodity">
                <Input
                  {...register(`lines_debit.${idx}.commodity`, {
                    maxLength: 3,
                  })}
                />
              </Input.Wrapper>

              <Group>
                <Button
                  type="button"
                  onClick={addLine_debit}
                  variant="default"
                  size="xs"
                >
                  debit
                </Button>

                <Button
                  onClick={() => removeLine_debit(line.account)}
                  variant="light"
                  color="red"
                  size="xs"
                >
                  del
                </Button>
              </Group>
            </div>
          );
        })}

        <h3>credit</h3>
        {values.lines_credit.map((line, idx) => {
          const key = `${line._tag}-${line.account}`;
          const accounts = filterAvailableAccounts(line);

          return (
            <div key={key}>
              <InputWrapper label="account">
                <NativeSelect {...register(`lines_credit.${idx}.account`)}>
                  {accounts.map((x) => (
                    <option key={x.name} value={x.name}>
                      {x.name}
                    </option>
                  ))}
                </NativeSelect>
              </InputWrapper>
              <InputWrapper label="credit">
                <Input
                  type="number"
                  {...register(`lines_credit.${idx}.credit`, {
                    valueAsNumber: true,
                  })}
                />
              </InputWrapper>
              <InputWrapper label="commodity">
                <Input
                  {...register(`lines_credit.${idx}.commodity`, {
                    maxLength: 3,
                  })}
                />
              </InputWrapper>
              <Group>
                <Button
                  type="button"
                  onClick={addLine_credit}
                  variant="default"
                  size="xs"
                >
                  credit
                </Button>

                <Button
                  onClick={() => removeLine_credit(line.account)}
                  variant="light"
                  color="red"
                  size="xs"
                >
                  del
                </Button>
              </Group>
            </div>
          );
        })}

        <h3>actions</h3>
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

      <JournalEntryList entries={[values]} />

      {valid ? <pre>{displayLedger(values)}</pre> : null}

      <h2>Presets</h2>
      <Group>
        {presets.map((preset) => (
          <Button
            key={preset.name}
            variant="default"
            onClick={() => setPreset(preset)}
          >
            preset: {preset.name}
          </Button>
        ))}
      </Group>
    </>
  );
};

const DebitCreditTableActions = (props: {
  debit: () => void;
  credit: () => void;
  swap: () => void;
  reset: () => void;
}) => (
  <Button.Group>
    <Button type="button" onClick={props.swap} variant="default">
      swap
    </Button>
    <Button type="button" onClick={props.reset} color="red">
      reset
    </Button>
  </Button.Group>
);
