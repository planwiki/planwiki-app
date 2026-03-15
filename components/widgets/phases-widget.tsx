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
  done: "border-emerald-300 bg-emerald-50 text-emerald-800",
  active: "border-sky-300 bg-sky-50 text-sky-900",
  pending: "border-amber-300 bg-amber-50 text-amber-900",
}

const phaseRowStyles: Record<PhaseItem["status"], string> = {
  done: "border-emerald-200 bg-white",
  active: "border-sky-950/10 bg-white",
  pending: "border-amber-950/10 bg-white",
}

const nextStatusLabels: Record<PhaseItem["status"], string> = {
  pending: "Set active",
  active: "Set done",
  done: "Reset",
}

export function PhasesWidget({
  widget,
  onPhaseStatusChange,
}: WidgetComponentProps) {
  const data = widget as PhasesWidgetData

  return (
    <Card className="rounded-none border border-zinc-950/10 bg-[#f7f2ea] py-0 shadow-none">
      <CardHeader className="border-b border-amber-950/10 px-4 py-4 md:px-6 md:py-5">
        <CardDescription className="text-[11px] uppercase tracking-[0.24em] text-amber-800/70">
          Delivery rhythm
        </CardDescription>
        <CardTitle className="text-lg font-semibold tracking-[-0.03em] text-amber-950">
          {data.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2 md:px-6">
        <div className="space-y-1">
          {data.items.map((item, index) => (
            <div key={item.id}>
              <div
                className={`grid gap-3 border px-3 py-4 transition-colors md:grid-cols-[auto_1fr] md:px-4 ${phaseRowStyles[item.status]}`}
              >
                <div className="flex min-w-24 flex-col gap-2">
                  <span className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                    Phase {index + 1}
                  </span>
                  {onPhaseStatusChange ? (
                    <button
                      type="button"
                      onClick={() => onPhaseStatusChange(data.id, item.id)}
                      className="group flex w-fit flex-col items-start gap-1 text-left"
                    >
                      <Badge
                        variant="outline"
                        className={`h-6 w-fit border px-2.5 text-[11px] uppercase tracking-[0.22em] ${phaseStyles[item.status]}`}
                      >
                        {item.status}
                      </Badge>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-600">
                        {nextStatusLabels[item.status]}
                      </span>
                    </button>
                  ) : (
                    <Badge
                      variant="outline"
                      className={`h-6 w-fit border px-2.5 text-[11px] uppercase tracking-[0.22em] ${phaseStyles[item.status]}`}
                    >
                      {item.status}
                    </Badge>
                  )}
                </div>
                <div className="space-y-3 pl-1">
                  <h3 className="text-base font-medium tracking-[-0.02em] text-zinc-950">
                    {item.name}
                  </h3>
                  <ul className="grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
                    {item.tasks.map((task) => (
                      <li
                        key={task}
                        className={`rounded-none border px-3 py-2 leading-6 ${
                          item.status === "done"
                            ? "border-emerald-200 bg-emerald-50/60 text-emerald-950"
                            : item.status === "active"
                              ? "border-sky-950/10 bg-sky-50/60 text-zinc-900"
                              : "border-zinc-950/10 bg-white text-zinc-800"
                        }`}
                      >
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {index < data.items.length - 1 ? (
                <Separator className="bg-amber-950/10" />
              ) : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
