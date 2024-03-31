export const parseFileName = (filename: string) => {
  const m = filename.match(/([A-Za-z]+)_(\d{4})_(\d{2}).csv/);
  if (!m) {
    throw new Error(`invalid filename: ${filename}`);
  }

  const [_, group, year, month] = m;
  return {
    group,
    year: Number(year),
    month: Number(month),
  };
};
