import { notFound } from "next/navigation"

import { WorkspaceCanvas } from "@/components/workspace-canvas"
import { db } from "@/lib/db"
import { workspaces } from "@/lib/db/schema"
import type { WorkspaceWidget } from "@/lib/widgets/widget-registry"
import { eq } from "drizzle-orm"

const deriveSummaryFromWidgets = (widgets: WorkspaceWidget[]) => {
  const notesWidget = widgets.find((widget) => widget.type === "notes")

  if (notesWidget?.type === "notes" && notesWidget.content.trim()) {
    return notesWidget.content
  }

  return "This workspace is ready to review and update."
}

export default async function PublicSharedWorkspacePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, slug),
  })

  if (!workspace?.isPublic) {
    notFound()
  }

  const widgets = ((workspace.widgets ?? []) as WorkspaceWidget[]).sort(
    (left, right) => left.order - right.order,
  )

  return (
    <main className="min-h-screen bg-[#f6f1e8]">
      <WorkspaceCanvas
        workspace={{
          id: workspace.id,
          slug: workspace.slug,
          isPublic: true,
          title: workspace.title ?? "Untitled workspace",
          summary: deriveSummaryFromWidgets(widgets),
          updatedAtLabel: "Shared workspace",
          widgets,
          versions: [
            {
              id: "current",
              label: "Current",
              summary: deriveSummaryFromWidgets(widgets),
              updatedAtLabel: "Shared workspace",
              widgets,
            },
          ],
        }}
      />
    </main>
  )
}
