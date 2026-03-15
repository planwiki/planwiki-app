import { ChecklistWidget } from "@/components/widgets/checklist-widget"
import { NotesWidget } from "@/components/widgets/notes-widget"
import { PhasesWidget } from "@/components/widgets/phases-widget"
import { TableWidget } from "@/components/widgets/table-widget"
import { WIDGET_REGISTRY, type WorkspaceWidget } from "@/lib/widgets/widget-registry"
import { cn } from "@/lib/utils"

interface WorkspaceWidgetRendererProps {
  widgets: WorkspaceWidget[]
  onChecklistItemToggle?: (widgetId: string, itemId: string) => void
  onPhaseStatusChange?: (widgetId: string, phaseId: string) => void
  selectedTableRows?: Record<string, number[]>
  onTableRowToggle?: (widgetId: string, rowIndex: number) => void
}

const renderWidget = (
  widget: WorkspaceWidget,
  {
    onChecklistItemToggle,
    onPhaseStatusChange,
    selectedTableRows,
    onTableRowToggle,
  }: Pick<
    WorkspaceWidgetRendererProps,
    | "onChecklistItemToggle"
    | "onPhaseStatusChange"
    | "selectedTableRows"
    | "onTableRowToggle"
  >,
) => {
  switch (widget.type) {
    case "checklist":
      return (
        <ChecklistWidget
          widget={widget}
          onChecklistItemToggle={onChecklistItemToggle}
        />
      )
    case "phases":
      return (
        <PhasesWidget
          widget={widget}
          onPhaseStatusChange={onPhaseStatusChange}
        />
      )
    case "table":
      return (
        <TableWidget
          widget={widget}
          selectedTableRows={selectedTableRows?.[widget.id] ?? []}
          onTableRowToggle={onTableRowToggle}
        />
      )
    case "notes":
      return <NotesWidget widget={widget} />
    default:
      return null
  }
}

export function WorkspaceWidgetRenderer({
  widgets,
  onChecklistItemToggle,
  onPhaseStatusChange,
  selectedTableRows,
  onTableRowToggle,
}: WorkspaceWidgetRendererProps) {
  const sortedWidgets = [...widgets].sort((left, right) => left.order - right.order)

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-12 lg:gap-6">
      {sortedWidgets.map((widget) => {
        const registryEntry = WIDGET_REGISTRY[widget.type]

        if (!registryEntry) {
          return null
        }

        return (
          <section
            key={widget.id}
            className={cn("min-w-0", registryEntry.className)}
          >
            {renderWidget(widget, {
              onChecklistItemToggle,
              onPhaseStatusChange,
              selectedTableRows,
              onTableRowToggle,
            })}
          </section>
        )
      })}
    </div>
  )
}
