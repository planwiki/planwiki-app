import { WIDGET_REGISTRY, type WorkspaceWidget } from "@/lib/widgets/widget-registry"
import { cn } from "@/lib/utils"

interface WorkspaceWidgetRendererProps {
  widgets: WorkspaceWidget[]
  onChecklistItemToggle?: (widgetId: string, itemId: string) => void
  selectedTableRows?: Record<string, number[]>
  onTableRowToggle?: (widgetId: string, rowIndex: number) => void
}

export function WorkspaceWidgetRenderer({
  widgets,
  onChecklistItemToggle,
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

        const WidgetComponent = registryEntry.component

        return (
          <section
            key={widget.id}
            className={cn("min-w-0", registryEntry.className)}
          >
            <WidgetComponent
              widget={widget}
              onChecklistItemToggle={onChecklistItemToggle}
              selectedTableRows={selectedTableRows?.[widget.id] ?? []}
              onTableRowToggle={onTableRowToggle}
            />
          </section>
        )
      })}
    </div>
  )
}
