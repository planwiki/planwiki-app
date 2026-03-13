import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type {
  PhaseItem,
  PhasesWidgetData,
  WidgetComponentProps,
} from "@/lib/widgets/widget-registry"

const phaseStyles: Record<PhaseItem["status"], string> = {
  done: "border-emerald-200 bg-emerald-50 text-emerald-700",
  active: "border-emerald-200 bg-emerald-100 text-emerald-800",
  pending: "border-zinc-200 bg-zinc-100 text-zinc-600",
}

export function PhasesWidget({ widget }: WidgetComponentProps) {
  const data = widget as PhasesWidgetData

  return (
    <Card className="rounded-none border border-zinc-950/10 bg-white/70 py-0 shadow-none backdrop-blur-sm">
      <CardHeader className="border-b border-zinc-950/10 px-4 py-4 md:px-6 md:py-5">
        <CardDescription className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
          Delivery rhythm
        </CardDescription>
        <CardTitle className="text-lg font-semibold tracking-[-0.03em] text-zinc-950">
          {data.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2 md:px-6">
        <div className="space-y-1">
          {data.items.map((item, index) => (
            <div key={item.id}>
              <div className="grid gap-3 py-4 md:grid-cols-[auto_1fr] md:gap-4">
                <Badge
                  variant="outline"
                  className={`h-6 border px-2.5 text-[11px] uppercase tracking-[0.22em] ${phaseStyles[item.status]}`}
                >
                  {item.status}
                </Badge>
                <div className="space-y-2">
                  <h3 className="text-base font-medium tracking-[-0.02em] text-zinc-950">
                    {item.name}
                  </h3>
                  <ul className="grid gap-2 text-sm text-zinc-600 sm:grid-cols-2">
                    {item.tasks.map((task) => (
                      <li
                        key={task}
                        className={`rounded-none border px-3 py-2 leading-6 ${
                          item.status === "done"
                            ? "border-emerald-200 bg-emerald-50/70 text-emerald-900"
                            : item.status === "active"
                              ? "border-emerald-200 bg-emerald-50/50 text-zinc-800"
                              : "border-zinc-950/10 bg-[#f7f2ea]"
                        }`}
                      >
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {index < data.items.length - 1 ? (
                <Separator className="bg-zinc-950/8" />
              ) : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
