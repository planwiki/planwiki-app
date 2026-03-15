import { WorkspaceWidgetSkeletons } from "@/components/widgets/workspace-widget-skeletons"
import { Skeleton } from "@/components/ui/skeleton"

export default function WorkspaceDetailLoading() {
  return (
    <section className="px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-5 border border-zinc-950/10 bg-white/65 p-5 shadow-none backdrop-blur-sm md:p-8">
          <div className="flex min-h-[220px] flex-col">
            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              Workspace overview
            </p>
            <Skeleton className="mt-3 h-10 w-full max-w-3xl rounded-none bg-zinc-950/8 sm:h-12 md:h-16" />
            <Skeleton className="mt-4 h-5 w-full max-w-2xl rounded-none bg-zinc-950/8" />
            <Skeleton className="mt-2 h-5 w-5/6 max-w-xl rounded-none bg-zinc-950/8" />
            <Skeleton className="mt-3 h-3 w-28 rounded-none bg-zinc-950/8" />

            <div className="mt-auto flex flex-col gap-2 pt-6 lg:flex-row lg:items-center lg:justify-end">
              <Skeleton className="h-10 w-full rounded-none bg-zinc-950/8 lg:w-40" />
              <Skeleton className="h-10 w-full rounded-none bg-zinc-950/8 lg:w-40" />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <WorkspaceWidgetSkeletons />
        </div>
      </div>
    </section>
  )
}
