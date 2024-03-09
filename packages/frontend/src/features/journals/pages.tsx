import { journalSpecification } from "@yuuka/core";
import { Link, useParams } from "react-router-dom";
import * as R from "remeda";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import useSWRImmutable from "swr/immutable";
import { fetcher } from "../../fetchers";
import { JournalEntryList } from "./JournalEntryList";

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

export const JournalEntryListPage = () => {
  const sheet = journalSpecification.dataSheet;
  const spec = sheet.list;

  const params = useParams();
  const req = spec.schema.req.parse(params);
  const qs = new URLSearchParams(req);

  const host = "http://localhost:3000";
  const endpoint = `${journalSpecification.resource}${spec.endpoint.path}`;

  const url = `${host}${endpoint}?${qs}`;
  const { data, error, isLoading } = useSWRImmutable(url, fetcher);
  const resp = data as (typeof spec)["inout"]["_out"];

  if (error) {
    return <div>failed to load</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  const entries = resp.entries;
  const { startDate, endDate } = req;

  return (
    <>
      <h1>Journal Entries</h1>
      <h2>
        {startDate} ~ {endDate}
      </h2>
      <JournalEntryList entries={entries} />
    </>
  );
};

export const JournalEntryReadPage = () => {
  return <div>read</div>;
};
