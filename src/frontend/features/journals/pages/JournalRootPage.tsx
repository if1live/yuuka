import { Anchor, Table } from "@mantine/core";
import { Link } from "react-router-dom";
import * as R from "remeda";

export const JournalRootPage = () => {
  type Range = {
    startDate: string;
    endDate: string;
  };

  // TODO: 2025년은 나중에 생각
  const year = 2024;

  const ranges = R.range(1, 12).map((i): Range => {
    const startDate = `${year}-${i.toString().padStart(2, "0")}-01`;
    const endDate = `${year}-${(i + 1).toString().padStart(2, "0")}-01`;
    return { startDate, endDate };
  });

  const now = new Date();

  return (
    <>
      <h1>Journal</h1>

      <Anchor component={Link} to="/journal/action/create">
        create
      </Anchor>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>start date</Table.Th>
            <Table.Th>end date</Table.Th>
            <Table.Th>journal</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {ranges.map((range, i) => {
            const { startDate, endDate } = range;
            const url = `/journal/list/${startDate}/${endDate}`;

            const current =
              startDate <= now.toISOString() && now.toISOString() < endDate;

            return (
              <Table.Tr key={range.startDate}>
                <Table.Td>{startDate}</Table.Td>
                <Table.Td>{endDate}</Table.Td>
                <Table.Td>
                  <Anchor component={Link} to={url}>
                    journal
                  </Anchor>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </>
  );
};
