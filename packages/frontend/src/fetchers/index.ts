// TODO: 중앙으로 옮겨야하는거
const host = "http://localhost:3000";

export const fetcher = async (...args: unknown[]) => {
  const [first, _] = args;
  const url = `${host}${first}`;

  const res = await fetch(url);
  return await res.json();
};
