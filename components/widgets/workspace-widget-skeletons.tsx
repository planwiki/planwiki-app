"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function WorkspaceWidgetSkeletons() {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-12 lg:gap-6">
      <section className="lg:col-span-12">
        <div className="border border-zinc-950/10 bg-white/70 p-5 md:p-6">
          <Skeleton className="h-4 w-28 rounded-none bg-[#ece4d7]" />
          <Skeleton className="mt-4 h-10 w-2/3 rounded-none bg-[#ece4d7]" />
          <Skeleton className="mt-4 h-5 w-full rounded-none bg-[#ece4d7]" />
          <Skeleton className="mt-2 h-5 w-5/6 rounded-none bg-[#ece4d7]" />
        </div>
      </section>

      <section className="lg:col-span-7 xl:col-span-8">
        <div className="border border-zinc-950/10 bg-white/70 p-5 md:p-6">
          <Skeleton className="h-4 w-24 rounded-none bg-[#ece4d7]" />
          <Skeleton className="mt-4 h-8 w-40 rounded-none bg-[#ece4d7]" />
          <div className="mt-5 grid gap-3">
            {[0, 1, 2].map((item) => (
              <Skeleton
                key={item}
                className="h-20 w-full rounded-none bg-[#ece4d7]"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="lg:col-span-5 xl:col-span-4">
        <div className="border border-zinc-950/10 bg-white/70 p-5 md:p-6">
          <Skeleton className="h-4 w-24 rounded-none bg-[#ece4d7]" />
          <Skeleton className="mt-4 h-8 w-32 rounded-none bg-[#ece4d7]" />
          <div className="mt-5 grid gap-3">
            {[0, 1, 2, 3].map((item) => (
              <Skeleton
                key={item}
                className="h-14 w-full rounded-none bg-[#ece4d7]"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
