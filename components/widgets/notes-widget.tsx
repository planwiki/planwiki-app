import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { NotesWidgetData, WidgetComponentProps } from "@/lib/widgets/widget-registry"

export function NotesWidget({ widget }: WidgetComponentProps) {
  const data = widget as NotesWidgetData

  return (
    <Card className="overflow-hidden rounded-none border border-zinc-950/10 bg-[#f7f2ea] py-0 shadow-none">
      <CardHeader className="border-b border-zinc-950/10 px-4 py-4 md:px-6 md:py-5">
        <CardDescription className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">
          Workspace frame
        </CardDescription>
        <CardTitle className="max-w-3xl text-xl font-semibold tracking-[-0.04em] text-zinc-950 md:text-2xl">
          {data.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-4 md:px-6 md:py-6">
        <p className="max-w-4xl text-sm leading-7 text-zinc-700 md:text-[15px]">
          {data.content}
        </p>
      </CardContent>
    </Card>
  )
}
