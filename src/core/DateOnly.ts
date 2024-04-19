import { assert } from "@toss/assert";
import * as R from "remeda";
import { z } from "zod";

export type YearText = `${number}${number}${number}${number}`;
export type MonthText = `${number}${number}`;
export type DayText = `${number}${number}`;

// 2012-03-04 를 type-safe하게 다루고 싶다
export type DateOnly = `${YearText}-${MonthText}-${DayText}`;
const re_date = /^(\d{4})-(\d{2})-(\d{2})$/;

const schema = z.custom<DateOnly>((value) => {
  if (typeof value !== "string") {
    throw new Error("must be a string", {
      cause: {
        value,
        type: typeof value,
      },
    });
  }

  const m = re_date.exec(value);
  if (!m) {
    throw new Error("invalid date format", {
      cause: {
        value,
        type: typeof value,
      },
    });
  }

  return value;
});

const split = (input: DateOnly) => {
  const tokens = input.split("-").map((x) => Number.parseInt(x));
  const year = tokens[0];
  const month = tokens[1];
  const day = tokens[2];

  assert(typeof year === "number");
  assert(typeof month === "number");
  assert(typeof day === "number");

  return { year, month, day };
};

const fromDate = (date: Date): DateOnly => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return combine({ year: y, month: m, day: d });
};

const combine = (input: { year: number; month: number; day: number }) => {
  const { year, month, day } = input;
  const m = month.toString().padStart(2, "0");
  const d = day.toString().padStart(2, "0");
  return `${year}-${m}-${d}` as DateOnly;
};

const setYear = (input: DateOnly, year: number) => {
  const { month, day } = split(input);
  return combine({ year, month, day });
};

const setMonth = (input: DateOnly, month: number) => {
  const { year, day } = split(input);
  return combine({ year, month, day });
};

const setDay = (input: DateOnly, day: number) => {
  const { year, month } = split(input);
  return combine({ year, month, day });
};

const setDayAsLastDayOfMonth = (input: DateOnly) => {
  return R.pipe(
    input,
    (x) => DateOnly.setDay(x, 1),
    (x) => DateOnly.addMonth(x, 1),
    (x) => DateOnly.addDay(x, -1),
  );
};

const addMonth = (input: DateOnly, v: number) => {
  assert(v >= 0);
  const data = split(input);
  const delta_year = Math.floor(v / 12);
  const delta_month = v % 12;
  return combine({
    year: data.year + delta_year,
    month: data.month + delta_month,
    day: data.day,
  });
};

const addDay = (input: DateOnly, v: number) => {
  const date = new Date(input);
  date.setDate(date.getDate() + v);
  return fromDate(date);
};

const convertDateToRange = (
  date: Date,
): { startDate: string; endDate: string } => {
  const d = fromDate(date);
  const startDate = setDay(d, 1);
  const endDate = setDayAsLastDayOfMonth(startDate);
  return {
    startDate,
    endDate,
  };
};

export const DateOnly = {
  schema,
  fromDate,
  split,
  combine,
  setYear,
  setMonth,
  setDay,
  setDayAsLastDayOfMonth,
  addMonth,
  addDay,
  convertDateToRange,
};
