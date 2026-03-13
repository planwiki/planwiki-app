import type { ReactNode } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset className="min-h-screen bg-[#f6f1e8]">
        <div className="min-h-screen">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
