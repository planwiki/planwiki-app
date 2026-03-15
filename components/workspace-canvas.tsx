"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import { WorkspaceUpdateSheet } from "@/components/workspace-update-sheet"
import { WorkspaceShareControls } from "@/components/workspace-share-controls"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WorkspaceWidgetSkeletons } from "@/components/widgets/workspace-widget-skeletons"
import { WorkspaceWidgetRenderer } from "@/components/widgets/workspace-widget-renderer"
import { trpc } from "@/lib/trpc"
import type {
  SampleWorkspaceVersion,
} from "@/lib/widgets/sample-workspaces"
import type { TableWidgetData, WorkspaceWidget } from "@/lib/widgets/widget-registry"

interface WorkspaceCanvasProps {
  workspace: {
    id: string
    slug: string
    isPublic?: boolean
    title: string
    summary: string
    updatedAtLabel: string
    widgets: WorkspaceWidget[]
    versions: SampleWorkspaceVersion[]
  }
  canUpdate?: boolean
}

const cloneWidgets = (widgets: WorkspaceWidget[]) =>
  JSON.parse(JSON.stringify(widgets)) as WorkspaceWidget[]

export function WorkspaceCanvas({
  workspace,
  canUpdate = false,
}: WorkspaceCanvasProps) {
  const nextPhaseStatus = {
    pending: "active",
    active: "done",
    done: "pending",
  } as const
  const latestVersion = workspace.versions[workspace.versions.length - 1]
  const [activeVersionId, setActiveVersionId] = useState(
    latestVersion?.id ?? "current",
  )
  const [summary, setSummary] = useState(latestVersion?.summary ?? workspace.summary)
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false)
  const [isRefreshingWidgets, setIsRefreshingWidgets] = useState(false)
  const [widgets, setWidgets] = useState<WorkspaceWidget[]>(
    cloneWidgets(latestVersion?.widgets ?? workspace.widgets),
  )
  const updateWorkspace = trpc.workspaces.updateWorkspace.useMutation()
  const saveWidgetState = trpc.workspaces.saveWidgetState.useMutation({
    onError: () => {
      toast.error("We could not save that widget change.")
    },
  })
  const saveQueueRef = useRef(Promise.resolve())

  const activeVersion = useMemo<SampleWorkspaceVersion>(() => {
    return (
      workspace.versions.find((version) => version.id === activeVersionId) ??
      latestVersion
    )
  }, [activeVersionId, latestVersion, workspace.versions])

  useEffect(() => {
    setWidgets(cloneWidgets(activeVersion.widgets))
    setSummary(activeVersion.summary)
  }, [activeVersion])

  const persistWidgets = (nextWidgets: WorkspaceWidget[]) => {
    if (!canUpdate) {
      return
    }

    saveQueueRef.current = saveQueueRef.current
      .catch(() => undefined)
      .then(() =>
        saveWidgetState.mutateAsync({
          workspaceId: workspace.id,
          widgets: nextWidgets,
        }),
      )
      .then(() => undefined)
  }

  const handleChecklistItemToggle = (widgetId: string, itemId: string) => {
    let nextWidgets: WorkspaceWidget[] = []

    setWidgets((currentWidgets) => {
      nextWidgets = currentWidgets.map((widget) => {
        if (widget.id !== widgetId || widget.type !== "checklist") {
          return widget
        }

        return {
          ...widget,
          items: widget.items.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item,
          ),
        }
      })

      return nextWidgets
    })

    if (nextWidgets.length) {
      persistWidgets(nextWidgets)
    }
  }

  const handleTableRowToggle = (widgetId: string, rowIndex: number) => {
    let nextWidgets: WorkspaceWidget[] = []

    setWidgets((currentWidgets) => {
      nextWidgets = currentWidgets.map((widget) => {
        if (widget.id !== widgetId || widget.type !== "table") {
          return widget
        }

        const selectedRows = (widget as TableWidgetData).selectedRows ?? []
        const nextRows = selectedRows.includes(rowIndex)
          ? selectedRows.filter((index) => index !== rowIndex)
          : [...selectedRows, rowIndex].sort((left, right) => left - right)

        return {
          ...widget,
          selectedRows: nextRows,
        }
      })

      return nextWidgets
    })

    if (nextWidgets.length) {
      persistWidgets(nextWidgets)
    }
  }

  const handlePhaseStatusChange = (widgetId: string, phaseId: string) => {
    let nextWidgets: WorkspaceWidget[] = []

    setWidgets((currentWidgets) => {
      nextWidgets = currentWidgets.map((widget) => {
        if (widget.id !== widgetId || widget.type !== "phases") {
          return widget
        }

        return {
          ...widget,
          items: widget.items.map((item) =>
            item.id === phaseId
              ? { ...item, status: nextPhaseStatus[item.status] }
              : item,
          ),
        }
      })

      return nextWidgets
    })

    if (nextWidgets.length) {
      persistWidgets(nextWidgets)
    }
  }

  const handleWorkspaceUpdate = async (value: string) => {
    setIsRefreshingWidgets(true)

    try {
      const result = await updateWorkspace.mutateAsync({
        workspaceId: workspace.id,
        text: value,
        source: "workspace-sheet",
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      setWidgets(
        [...result.data.widgets].sort((left, right) => left.order - right.order),
      )
      setSummary(result.data.summary)
      toast.success("Workspace updated.")
    } finally {
      setIsRefreshingWidgets(false)
    }
  }

  return (
    <section className="px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-5 border border-zinc-950/10 bg-white/65 p-5 shadow-none backdrop-blur-sm md:p-8">
          <div className="flex min-h-[220px] flex-col">
            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              Workspace overview
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-4xl md:text-6xl">
              {workspace.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-700 md:text-[15px]">
              {summary}
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.22em] text-zinc-500">
              {activeVersion.updatedAtLabel ?? workspace.updatedAtLabel}
            </p>

            <div className="mt-auto flex flex-col gap-2 pt-6 lg:flex-row lg:items-center lg:justify-end">
              {workspace.versions.length > 1 ? (
                <Select value={activeVersionId} onValueChange={setActiveVersionId}>
                  <SelectTrigger
                    className="h-10 w-full rounded-none border-zinc-950/10 bg-[#f7f2ea] px-3 text-zinc-950 shadow-none lg:min-w-40 lg:w-auto"
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
              ) : null}

              {canUpdate ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUpdateSheetOpen(true)}
                  className="h-10 w-full rounded-none border-zinc-950/15 bg-[#f7f2ea] px-4 text-zinc-700 shadow-none hover:bg-white lg:w-auto"
                >
                  Update workspace
                </Button>
              ) : null}

              {canUpdate ? (
                <WorkspaceShareControls
                  workspaceId={workspace.id}
                  slug={workspace.slug}
                  isPublic={workspace.isPublic}
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6">
          {isRefreshingWidgets ? (
            <WorkspaceWidgetSkeletons />
          ) : (
            <WorkspaceWidgetRenderer
              widgets={widgets}
              onChecklistItemToggle={canUpdate ? handleChecklistItemToggle : undefined}
              onPhaseStatusChange={canUpdate ? handlePhaseStatusChange : undefined}
              onTableRowToggle={canUpdate ? handleTableRowToggle : undefined}
            />
          )}
        </div>
      </div>

      {canUpdate ? (
        <WorkspaceUpdateSheet
          isOpen={isUpdateSheetOpen}
          isPending={updateWorkspace.isPending}
          onOpenChange={setIsUpdateSheetOpen}
          onSubmit={handleWorkspaceUpdate}
        />
      ) : null}
    </section>
  )
}
