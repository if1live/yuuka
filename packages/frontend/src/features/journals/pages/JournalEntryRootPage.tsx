import { Link } from "react-router-dom";
import * as R from "remeda";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";

export const JournalEntryRootPage = () => {
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

      <Button as={Link} to="/journal/action/create">
        create
      </Button>

      <Table selectable celled compact="very">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>start date</TableHeaderCell>
            <TableHeaderCell>end date</TableHeaderCell>
            <TableHeaderCell>journal</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ranges.map((range, i) => {
            const { startDate, endDate } = range;
            const url = `/journal/list/${startDate}/${endDate}`;

            const current =
              startDate <= now.toISOString() && now.toISOString() < endDate;

            return (
              <TableRow key={range.startDate} positive={current}>
                <TableCell>{startDate}</TableCell>
                <TableCell>{endDate}</TableCell>
                <TableCell>
                  <Link to={url}>journal</Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
