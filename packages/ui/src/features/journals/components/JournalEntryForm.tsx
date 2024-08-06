import { ErrorMessage } from "@hookform/error-message";
import {
  Button,
  Divider,
  Group,
  Input,
  InputWrapper,
  NativeSelect,
  NumberInput,
  Table,
} from "@mantine/core";
import { JournalEntry, type Preset } from "@yuuka/api";
import type {
  JournalLine,
  JournalLine_Credit,
  JournalLine_Debit,
} from "@yuuka/api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as R from "remeda";
import { useMasterData } from "../../../providers/MasterDataProvider.js";
import { JournalEntryList } from "./JournalEntryList.js";
import { JournalPresetList } from "./JournalPresetList.js";
import { LedgerCodeView } from "./LedgerCodeView.js";
import { LedgerCopyButton } from "./LedgerCopyButton.js";

export const JournalEntryForm = (props: {
  defaultValue: JournalEntry;
  onSubmit: (entry: JournalEntry) => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);

  const masterdata = useMasterData();
  const presets = masterdata.presets;

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

  const setEntry = (next: JournalEntry) => {
    const fields = ["lines_credit", "lines_debit", "brief"] as const;
    const keys: ReadonlyArray<keyof JournalEntry> = fields;

    const prev: JournalEntry = values;
    for (const field of fields) {
      const prev_data = prev[field];
      const next_data = next[field];
      if (prev_data !== next_data) {
        setValue(field, next_data);
      }
    }
  };

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
    const next = JournalEntry.swap(values);
    setEntry(next);
  };

  const derive = () => {
    const next = JournalEntry.derive(values);
    setEntry(next);
  };

  const resetLines = () => {
    // 날짜는 이어서 작성하고 싶다.
    setValue("brief", props.defaultValue.brief);
    setValue("lines_debit", props.defaultValue.lines_debit);
    setValue("lines_credit", props.defaultValue.lines_credit);
  };

  const removeLine = (account: string) => {
    const next = JournalEntry.remove(values, account);
    setEntry(next);
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
    const lines_debit = preset.lines_debit.map(
      (line): JournalLine_Debit => ({ _tag: "debit", ...line }),
    );

    const lines_credit = preset.lines_credit.map(
      (line): JournalLine_Credit => ({ _tag: "credit", ...line }),
    );

    setValue("lines_debit", lines_debit);
    setValue("lines_credit", lines_credit);
    setValue("brief", preset.brief);
  };

  const onSubmit = async (data: JournalEntry) => {
    setLoading(true);
    await props.onSubmit(data);
    setLoading(false);
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

        <Divider my="sm" />

        <Input.Wrapper>
          <DebitCreditTableActions
            debit={addLine_debit}
            credit={addLine_credit}
            derive={derive}
            swap={swapLines}
            reset={resetLines}
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
                <NumberInput
                  {...(register(`lines_debit.${idx}.debit`, {
                    valueAsNumber: true,
                    min: 0,
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                  }) as any)}
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
                  onClick={() => removeLine(line.account)}
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
                <NumberInput
                  {...(register(`lines_credit.${idx}.credit`, {
                    valueAsNumber: true,
                    min: 0,
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                  }) as any)}
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
                  onClick={() => removeLine(line.account)}
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

        <JournalEntryList entries={[values]} />

        <Button type="submit" disabled={!valid} loading={loading}>
          submit
        </Button>
      </form>

      {valid ? (
        <>
          <h2>ledger</h2>
          <LedgerCodeView entry={values} />
          <LedgerCopyButton entry={values} />
        </>
      ) : null}

      <h2>Presets</h2>
      <JournalPresetList onPreset={setPreset} />
    </>
  );
};

const DebitCreditTableActions = (props: {
  debit: () => void;
  credit: () => void;
  swap: () => void;
  derive: () => void;
  reset: () => void;
}) => (
  <Button.Group>
    <Button type="button" onClick={props.swap} variant="default" size="xs">
      swap
    </Button>
    <Button type="button" onClick={props.debit} variant="default" size="xs">
      debit
    </Button>
    <Button type="button" onClick={props.credit} variant="default" size="xs">
      credit
    </Button>
    <Button type="button" onClick={props.derive} variant="default" size="xs">
      derive
    </Button>
    <Button type="button" onClick={props.reset} color="red" size="xs">
      reset
    </Button>
  </Button.Group>
);
