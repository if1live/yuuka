import { ErrorMessage } from "@hookform/error-message";
import { AccountCode, JournalEntry } from "@yuuka/core";
import { JournalEntryLine } from "@yuuka/core";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as R from "remeda";
import {
  Button,
  ButtonGroup,
  ButtonOr,
  Form,
  FormField,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import { MasterDataContext } from "../../../contexts/MasterDataContext";
import { JournalEntryList } from "./JournalEntryList";

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
  const valid = result.isOk() && R.isEmpty(errors);

  // TODO: form이 바뀐걸 상위로 전달할 더 좋은 방법?

  const findUnusedCode = (): number => {
    const list_used = values.lines.map((x) => x.code);
    const list_full = masterdata.accountCodes.map((x) => x.code);
    const list_candidate = R.difference(list_full, list_used);
    return list_candidate[0] ?? 101_000;
  };

  const addLine_debit = () => {
    const lines_debit = JournalEntryLine.filter_debit(values.lines);
    const lines_credit = JournalEntryLine.filter_credit(values.lines);

    const next: JournalEntryLine = {
      _tag: "debit",
      code: findUnusedCode(),
      debit: 0,
    };

    const lines = [...lines_debit, next, ...lines_credit];
    setValue("lines", lines);
  };

  const addLine_credit = () => {
    const lines_debit = JournalEntryLine.filter_debit(values.lines);
    const lines_credit = JournalEntryLine.filter_credit(values.lines);

    const next: JournalEntryLine = {
      _tag: "credit",
      code: findUnusedCode(),
      credit: 0,
    };

    const lines = [...lines_debit, ...lines_credit, next];
    setValue("lines", lines);
  };

  const removeLine = (code: number) => {
    const lines = values.lines.filter((x) => x.code !== code);
    setValue("lines", lines);
  };

  const displayCSV = (entry: JournalEntry) => {
    const mat = JournalEntry.toCSV(entry);
    return mat.map((x) => x.join(",")).join("\n");
  };

  const filterAvailableAccountCodes = (line: JournalEntryLine) => {
    // code는 겹치면 안된다. 자신은 포함되어야한다
    const codes_used = values.lines.map((x) => x.code);
    const accounts = masterdata.accountCodes.filter((x) => {
      if (x.code === line.code) return true;
      if (codes_used.includes(x.code)) return false;
      return true;
    });
    return accounts;
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormField>
          <label>date</label>
          <input
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
        </FormField>

        <FormField>
          <label>id</label>
          <input
            {...register("id", {
              required: "id is required",
            })}
          />
          <ErrorMessage
            errors={errors}
            name="id"
            render={({ message }) => <p>{message}</p>}
          />
        </FormField>

        <FormField>
          <label>brief</label>
          <input
            {...register("brief", {
              required: "brief is required",
            })}
          />
          <ErrorMessage
            errors={errors}
            name="brief"
            render={({ message }) => <p>{message}</p>}
          />
        </FormField>

        <Table compact="very" color="blue">
          <DebitTableHeader />
          <TableBody>
            {values.lines.map((line, idx) => {
              const key = `line-${idx}`;
              const accounts = filterAvailableAccountCodes(line);

              if (line._tag !== "debit") {
                return null;
              }

              return (
                <TableRow key={key}>
                  <TableCell>
                    <select
                      {...register(`lines.${idx}.code`, {
                        valueAsNumber: true,
                      })}
                    >
                      {accounts.map((x) => (
                        <option key={x.code} value={x.code}>
                          [{x.code}] {x.name}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      {...register(`lines.${idx}.debit`, {
                        valueAsNumber: true,
                      })}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      size="mini"
                      onClick={() => removeLine(line.code)}
                    >
                      del
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <Table compact="very" color="red">
          <CreditTableHeader />
          <TableBody>
            {values.lines.map((line, idx) => {
              const key = `line-${idx}`;
              const accounts = filterAvailableAccountCodes(line);

              if (line._tag !== "credit") {
                return null;
              }

              return (
                <TableRow key={key}>
                  <TableCell>
                    <select
                      {...register(`lines.${idx}.code`, {
                        valueAsNumber: true,
                      })}
                    >
                      {accounts.map((x) => (
                        <option key={x.code} value={x.code}>
                          [{x.code}] {x.name}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      {...register(`lines.${idx}.credit`, {
                        valueAsNumber: true,
                      })}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      size="mini"
                      onClick={() => removeLine(line.code)}
                    >
                      del
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <FormField>
          <DebitCreditTableActions
            debit={addLine_debit}
            credit={addLine_credit}
          />
        </FormField>

        <FormField>
          <Button type="submit" disabled={!valid}>
            submit
          </Button>
        </FormField>
      </Form>

      <JournalEntryList entries={[values]} />

      {/* 좀 무식한데 csv 접근을 열어둠 */}
      {valid ? <pre>{displayCSV(values)}</pre> : null}
    </>
  );
};

const DebitTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHeaderCell>code</TableHeaderCell>
      <TableHeaderCell>debit</TableHeaderCell>
      <TableHeaderCell>actions</TableHeaderCell>
    </TableRow>
  </TableHeader>
);

const CreditTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHeaderCell>code</TableHeaderCell>
      <TableHeaderCell>credit</TableHeaderCell>
      <TableHeaderCell>actions</TableHeaderCell>
    </TableRow>
  </TableHeader>
);

const DebitCreditTableActions = (props: {
  debit: () => void;
  credit: () => void;
}) => (
  <ButtonGroup size="mini">
    <Button type="button" onClick={props.debit}>
      debit
    </Button>
    <ButtonOr />
    <Button type="button" onClick={props.credit}>
      credit
    </Button>
  </ButtonGroup>
);
