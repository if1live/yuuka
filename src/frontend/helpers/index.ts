export const convertDateToYMD = (date: Date): string => {
  return date.toISOString().split("T")[0] ?? "";
};

export const convertDateToRange = (
  date: Date,
): { startDate: string; endDate: string } => {
  const start = new Date(date);
  start.setDate(1);

  const end = new Date(date);
  end.setDate(1);
  end.setUTCMonth(end.getUTCMonth() + 1);

  return {
    startDate: convertDateToYMD(start),
    endDate: convertDateToYMD(end),
  };
};
