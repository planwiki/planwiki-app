import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ChecklistWidgetData, WidgetComponentProps } from "@/lib/widgets/widget-registry"

const getCompletion = (items: ChecklistWidgetData["items"]) => {
  if (!items.length) {
    return 0
  }

  const completed = items.filter((item) => item.done).length
  return Math.round((completed / items.length) * 100)
}

export function ChecklistWidget({
  widget,
  onChecklistItemToggle,
}: WidgetComponentProps) {
  const data = widget as ChecklistWidgetData
  const completion = getCompletion(data.items)
  const completed = data.items.filter((item) => item.done).length

  return (
    <Card className="rounded-none border border-zinc-950/10 bg-white/70 py-0 shadow-none backdrop-blur-sm">
      <CardHeader className="border-b border-zinc-950/10 px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardDescription className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              Execution track
            </CardDescription>
            <CardTitle className="text-lg font-semibold tracking-[-0.03em] text-zinc-950">
              {data.title}
            </CardTitle>
          </div>
          <div className="min-w-28 text-left sm:text-right">
            <p className="text-2xl font-semibold tracking-[-0.05em] text-zinc-950">
              {completion}%
            </p>
            <p className="text-xs text-zinc-500">
              {completed}/{data.items.length} closed
            </p>
          </div>
        </div>
        <Progress
          value={completion}
          className="mt-1 h-2 bg-[#ece4d7] [&_[data-slot=progress-indicator]]:bg-emerald-600"
        />
      </CardHeader>
      <CardContent className="px-4 py-4 md:px-6">
        <div className="space-y-2">
          {data.items.map((item) => (
            <label
              key={item.id}
              className={`flex min-h-12 items-start gap-3 rounded-none border px-3 py-3 transition-all ${
                item.done
                  ? "border-emerald-200 bg-emerald-50/70"
                  : "border-zinc-950/10 bg-[#f7f2ea] hover:border-zinc-950/20 hover:bg-white"
              }`}
            >
              <Checkbox
                checked={item.done}
                onCheckedChange={() =>
                  onChecklistItemToggle?.(data.id, item.id)
                }
                className="mt-0.5"
              />
              <span
                className={`text-sm leading-6 ${
                  item.done ? "text-emerald-800 line-through" : "text-zinc-900"
                }`}
              >
                {item.text}
              </span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
