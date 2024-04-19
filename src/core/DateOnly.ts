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

export const DateOnly = {
  schema,
};
