export const fetcher = async (...args: unknown[]) => {
  // TODO:
  const res = await fetch(...args);
  return await res.json();
};
