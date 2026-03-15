import { Skeleton } from "@/components/ui/skeleton"

export default function WorkspacesLoading() {
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
        <div className="mx-auto grid w-full max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex min-h-[280px] flex-col border border-zinc-950/10 bg-white p-5 md:min-h-[320px] md:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <Skeleton className="h-8 w-2/3 rounded-none bg-zinc-950/8" />
                <Skeleton className="h-4 w-20 rounded-none bg-zinc-950/8" />
              </div>

              <Skeleton className="mt-4 h-5 w-full rounded-none bg-zinc-950/8" />
              <Skeleton className="mt-2 h-5 w-5/6 rounded-none bg-zinc-950/8" />
              <Skeleton className="mt-2 h-5 w-3/4 rounded-none bg-zinc-950/8" />

              <div className="mt-5 flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((__, badgeIndex) => (
                  <Skeleton
                    key={badgeIndex}
                    className="h-6 w-20 rounded-none bg-zinc-950/8"
                  />
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-zinc-950/8 pt-4">
                <Skeleton className="h-4 w-20 rounded-none bg-zinc-950/8" />
                <Skeleton className="h-4 w-28 rounded-none bg-zinc-950/8" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
