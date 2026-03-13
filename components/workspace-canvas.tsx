"use client"

import { useEffect, useMemo, useState } from "react"

import { WorkspaceShareControls } from "@/components/workspace-share-controls"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WorkspaceWidgetRenderer } from "@/components/widgets/workspace-widget-renderer"
import type {
  SampleWorkspace,
  SampleWorkspaceVersion,
} from "@/lib/widgets/sample-workspaces"
import type { WorkspaceWidget } from "@/lib/widgets/widget-registry"

interface WorkspaceCanvasProps {
  workspace: SampleWorkspace
}

const cloneWidgets = (widgets: WorkspaceWidget[]) =>
  JSON.parse(JSON.stringify(widgets)) as WorkspaceWidget[]

export function WorkspaceCanvas({ workspace }: WorkspaceCanvasProps) {
  const latestVersion = workspace.versions[workspace.versions.length - 1]
  const [activeVersionId, setActiveVersionId] = useState(
    latestVersion?.id ?? "current",
  )
  const [widgets, setWidgets] = useState<WorkspaceWidget[]>(
    cloneWidgets(latestVersion?.widgets ?? workspace.widgets),
  )
  const [selectedTableRows, setSelectedTableRows] = useState<
    Record<string, number[]>
  >({})

  const activeVersion = useMemo<SampleWorkspaceVersion>(() => {
    return (
      workspace.versions.find((version) => version.id === activeVersionId) ??
      latestVersion
    )
  }, [activeVersionId, latestVersion, workspace.versions])

  useEffect(() => {
    setWidgets(cloneWidgets(activeVersion.widgets))
    setSelectedTableRows({})
  }, [activeVersion])

  const handleChecklistItemToggle = (widgetId: string, itemId: string) => {
    setWidgets((currentWidgets) =>
      currentWidgets.map((widget) => {
        if (widget.id !== widgetId || widget.type !== "checklist") {
          return widget
        }

        return {
          ...widget,
          items: widget.items.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item,
          ),
        }
      }),
    )
  }

  const handleTableRowToggle = (widgetId: string, rowIndex: number) => {
    setSelectedTableRows((current) => {
      const existing = current[widgetId] ?? []
      const nextRows = existing.includes(rowIndex)
        ? existing.filter((index) => index !== rowIndex)
        : [...existing, rowIndex]

      return {
        ...current,
        [widgetId]: nextRows,
      }
    })
  }

  return (
    <section className="px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-5 border border-zinc-950/10 bg-white/65 p-5 shadow-none backdrop-blur-sm md:p-8">
          <div className="flex min-h-[220px] flex-col">
            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              Workspace overview
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-zinc-950 md:text-6xl">
              {workspace.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-700 md:text-[15px]">
              {activeVersion.summary}
            </p>

            <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row sm:items-center sm:justify-end">
              <Select value={activeVersionId} onValueChange={setActiveVersionId}>
                <SelectTrigger
                  className="h-10 min-w-40 rounded-none border-zinc-950/10 bg-[#f7f2ea] px-3 text-zinc-950 shadow-none"
                >
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent className="rounded-none border border-zinc-950/10 bg-[#f6f1e8] shadow-none ring-0">
                  {workspace.versions.map((version, index) => (
                    <SelectItem
                      key={version.id}
                      value={version.id}
                      className="rounded-none"
                    >
                      {index === workspace.versions.length - 1
                        ? `${version.label} - Latest`
                        : version.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <WorkspaceShareControls slug={workspace.slug} />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <WorkspaceWidgetRenderer
            widgets={widgets}
            onChecklistItemToggle={handleChecklistItemToggle}
            selectedTableRows={selectedTableRows}
            onTableRowToggle={handleTableRowToggle}
          />
        </div>
      </div>
    </section>
  )
}
