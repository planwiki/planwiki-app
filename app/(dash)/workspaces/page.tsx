import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { sampleWorkspaces } from "@/lib/widgets/sample-workspaces"

export default function WorkspacesPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-950/8 px-4 py-4 md:px-6">
        <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
          Workspaces
        </p>
        <h1 className="text-xl font-semibold tracking-[-0.03em] text-zinc-950">
          All workspaces
        </h1>
      </header>

      <section className="flex flex-1 flex-col px-4 py-6 md:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sampleWorkspaces.map((workspace) => (
              <Link
                key={workspace.id}
                href={`/workspaces/${workspace.slug}`}
                className="group flex h-full min-h-[320px] flex-col border border-zinc-950/10 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-950 md:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] text-zinc-950">
                      {workspace.title}
                    </h3>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {workspace.updatedAtLabel}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-zinc-700">
                  {workspace.summary}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {workspace.widgets.map((widget) => (
                    <Badge
                      key={widget.id}
                      variant="outline"
                      className="border-zinc-950/10 bg-[#f7f2ea] text-zinc-600"
                    >
                      {widget.type}
                    </Badge>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-zinc-950/8 pt-4 text-sm text-zinc-600">
                  <span>{workspace.widgets.length} widgets</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    Open workspace
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
