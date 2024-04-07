import { z } from "zod";

type YearText = `${number}${number}${number}${number}`;
type MonthText = `${number}${number}`;
type DayText = `${number}${number}`;

// 2012-03-04 를 type-safe하게 다루고 싶다
export type DateText = `${YearText}-${MonthText}-${DayText}`;
const re_date = /^(\d{4})-(\d{2})-(\d{2})$/;

export const dateSchema = z.custom<DateText>((value) => {
  if (typeof value !== "string") {
    throw new Error("must be a string");
  }

  const m = re_date.exec(value);
  if (!m) {
    throw new Error("invalid date format");
  }

  return value;
});
