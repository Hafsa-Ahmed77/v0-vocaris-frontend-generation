import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Row = {
  id: string
  title: string
  date: string
  summary: string
}

export function MeetingSummariesTable({ rows }: { rows: Row[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Summary</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">
              <a href={`/meetings/${r.id}`} className="underline underline-offset-4">
                {r.title}
              </a>
            </TableCell>
            <TableCell>{r.date}</TableCell>
            <TableCell className="max-w-[420px] truncate">{r.summary}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
