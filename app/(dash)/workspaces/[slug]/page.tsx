import { headers } from "next/headers"
import { notFound } from "next/navigation"

import { WorkspaceCanvas } from "@/components/workspace-canvas"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { workspaces } from "@/lib/db/schema"
import { findSampleWorkspaceBySlug } from "@/lib/widgets/sample-workspaces"
import type { WorkspaceWidget } from "@/lib/widgets/widget-registry"
import { eq } from "drizzle-orm"

export const dynamic = "force-dynamic"

const deriveSummaryFromWidgets = (widgets: WorkspaceWidget[]) => {
  const notesWidget = widgets.find((widget) => widget.type === "notes")

  if (notesWidget?.type === "notes" && notesWidget.content.trim()) {
    return notesWidget.content
  }

  return "This workspace is ready to review and update."
}

export default async function WorkspaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, slug),
  })

  if (workspace) {
    const canView =
      Boolean(workspace.isPublic) || session?.user?.id === workspace.userId

    if (!canView) {
      notFound()
    }

    const widgets = ((workspace.widgets ?? []) as WorkspaceWidget[]).sort(
      (left, right) => left.order - right.order,
    )

    return (
      <WorkspaceCanvas
        workspace={{
          id: workspace.id,
          slug: workspace.slug,
          isPublic: Boolean(workspace.isPublic),
          title: workspace.title ?? "Untitled workspace",
          summary: deriveSummaryFromWidgets(widgets),
          updatedAtLabel: "Updated recently",
          widgets,
          versions: [
            {
              id: "current",
              label: "Current",
              summary: deriveSummaryFromWidgets(widgets),
              updatedAtLabel: "Updated recently",
              widgets,
            },
          ],
        }}
        canUpdate={session?.user?.id === workspace.userId}
      />
    )
  }

  const sampleWorkspace = findSampleWorkspaceBySlug(slug)

  if (!sampleWorkspace) {
    notFound()
  }

  return (
    <WorkspaceCanvas workspace={sampleWorkspace} />
  )
}
