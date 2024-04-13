import { Table } from "@mantine/core";

export const QueryResultTable = (props: {
  columns: string[];
  rows: Record<string, unknown>[];
}) => {
  const { columns, rows } = props;

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            {columns.map((column) => (
              <Table.Th key={column}>{column}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row, i) => {
            const key = `row-${i}`;
            return <QueryResultRow key={key} columns={columns} row={row} />;
          })}
        </Table.Tbody>
      </Table>
      <p>rows: {rows.length}</p>
    </>
  );
};

const QueryResultRow = (props: {
  columns: string[];
  row: Record<string, unknown>;
}) => {
  const { columns, row } = props;

  return (
    <Table.Tr>
      {columns.map((column) => (
        <Table.Td key={column}>
          <DataValueCell value={row[column]} />
        </Table.Td>
      ))}
    </Table.Tr>
  );
};

const DataValueCell = (props: {
  value: unknown;
}) => {
  const { value } = props;
  return <>{`${value}`}</>;
};
