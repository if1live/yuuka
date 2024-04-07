import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";

export const QueryResultTable = (props: {
  columns: string[];
  rows: Record<string, unknown>[];
}) => {
  const { columns, rows } = props;

  return (
    <>
      <Table celled compact="very">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHeaderCell key={column}>{column}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => {
            const key = `row-${i}`;
            return <QueryResultRow key={key} columns={columns} row={row} />;
          })}
        </TableBody>
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
    <TableRow>
      {columns.map((column) => (
        <TableCell key={column}>
          <DataValueCell value={row[column]} />
        </TableCell>
      ))}
    </TableRow>
  );
};

const DataValueCell = (props: {
  value: unknown;
}) => {
  const { value } = props;
  return <>{`${value}`}</>;
};
