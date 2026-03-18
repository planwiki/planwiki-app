import { desc, eq } from "drizzle-orm"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { workspaces } from "@/lib/db/schema"
import type { WorkspaceWidget } from "@/lib/widgets/widget-registry"

const deriveSummaryFromWidgets = (widgets: WorkspaceWidget[]) => {
  const notesWidget = widgets.find((widget) => widget.type === "notes")

  if (notesWidget?.type === "notes" && notesWidget.content.trim()) {
    return notesWidget.content
  }

  return "A structured workspace ready to review and update."
}

export default async function WorkspacesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect("/login")
  }

  const userWorkspaces = await db.query.workspaces.findMany({
    where: eq(workspaces.userId, session.user.id),
    orderBy: desc(workspaces.updatedAt),
  })

  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-950/8 px-4 py-4 md:px-6 md:py-5">
        <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
          Workspaces
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-zinc-950 md:text-2xl">
          All workspaces
        </h1>
      </header>

      <section className="flex flex-1 flex-col px-4 py-6 md:px-6">
        <div className="mx-auto w-full max-w-6xl">
          {userWorkspaces.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {userWorkspaces.map((workspace) => {
                const widgets = ((workspace.widgets ?? []) as WorkspaceWidget[]).sort(
                  (left, right) => left.order - right.order,
                )

                return (
                  <Link
                    key={workspace.id}
                    href={`/workspaces/${workspace.slug}`}
                    className="group flex h-full min-h-[280px] flex-col rounded-sm border border-zinc-950/10 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-950 md:min-h-[320px] md:p-6"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold tracking-[-0.04em] text-zinc-950 md:text-2xl">
                          {workspace.title ?? "Untitled workspace"}
                        </h3>
                      </div>
                      <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Recently updated
                      </span>
                    </div>

                    <p className="mt-4 line-clamp-4 text-sm leading-7 text-zinc-700">
                      {deriveSummaryFromWidgets(widgets)}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {widgets.map((widget) => (
                        <Badge
                          key={widget.id}
                          variant="outline"
                          className="rounded-sm border-zinc-950/10 bg-[#f7f2ea] text-zinc-600"
                        >
                          {widget.type}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-4 border-t border-zinc-950/8 pt-4 text-sm text-zinc-600">
                      <span className="shrink-0">{widgets.length} widgets</span>
                      <span className="text-right transition-transform duration-200 group-hover:translate-x-1">
                        Open workspace
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="rounded-sm border border-zinc-950/10 bg-white p-6 md:p-8">
              <p className="text-lg font-medium tracking-[-0.03em] text-zinc-950">
                No workspaces yet
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600">
                Generate your first workspace from the New page and it will show
                up here.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
