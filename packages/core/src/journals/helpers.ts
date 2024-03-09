export const parseJournalFileName = (filename: string) => {
  const m = filename.match(/journal_(\d{4})_(\d{2}).csv/);
  if (!m) {
    throw new Error(`invalid filename: ${filename}`);
  }

  const [_, year, month] = m;
  return { year: Number(year), month: Number(month) };
};
