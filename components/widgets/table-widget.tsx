import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import type { TableWidgetData, WidgetComponentProps } from "@/lib/widgets/widget-registry"

export function TableWidget({
  widget,
  selectedTableRows = [],
  onTableRowToggle,
}: WidgetComponentProps) {
  const data = widget as TableWidgetData
  const activeRows = selectedTableRows.length ? selectedTableRows : (data.selectedRows ?? [])

  return (
    <Card className="rounded-none border border-zinc-950/10 bg-white py-0 shadow-none">
      <CardHeader className="border-b border-zinc-950/10 px-4 py-4 md:px-6 md:py-5">
        <CardDescription className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
          Structured reference
        </CardDescription>
        <CardTitle className="text-lg font-semibold tracking-[-0.03em] text-zinc-950">
          {data.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 py-0">
        <Table className="text-sm">
          <TableHeader>
            <TableRow className="border-zinc-950/10 bg-[#f7f2ea] hover:bg-[#f7f2ea]">
              <TableHead className="h-11 w-12 px-4 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                Pick
              </TableHead>
              {data.columns.map((column) => (
                <TableHead
                  key={column}
                  className="h-11 px-4 text-[11px] uppercase tracking-[0.24em] text-zinc-500 md:px-6"
                >
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((row, index) => (
              <TableRow
                key={`${data.id}-${index}`}
                onClick={() => onTableRowToggle?.(data.id, index)}
                className={`border-zinc-950/10 ${
                  activeRows.includes(index)
                    ? "border-emerald-200 bg-emerald-50/70"
                    : "bg-white hover:bg-[#faf8f3]"
                } ${onTableRowToggle ? "cursor-pointer" : ""}`}
                data-state={activeRows.includes(index) ? "selected" : undefined}
              >
                <TableCell className="px-4 py-3">
                  <Checkbox
                    checked={activeRows.includes(index)}
                    onClick={(event) => event.stopPropagation()}
                    onCheckedChange={() => onTableRowToggle?.(data.id, index)}
                    className="border-zinc-950/20 data-checked:border-emerald-700 data-checked:bg-emerald-700"
                  />
                </TableCell>
                {row.map((cell, cellIndex) => (
                  <TableCell
                    key={`${data.id}-${index}-${cellIndex}`}
                    className={`px-4 py-3 align-top whitespace-normal md:px-6 ${
                      activeRows.includes(index)
                        ? "text-emerald-950"
                        : "text-zinc-700"
                    }`}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
