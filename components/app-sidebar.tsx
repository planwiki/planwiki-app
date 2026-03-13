"use client";

import * as React from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Delete02Icon,
  FolderShared01Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  Edit02Icon,
  SidebarLeftIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { NavUser } from "@/components/nav-user";
import { sampleWorkspaces } from "@/lib/widgets/sample-workspaces";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainNav = [
  {
    title: "Workspaces",
    href: "/workspaces",
    icon: FolderShared01Icon,
    match: (pathname: string) => pathname.startsWith("/workspaces"),
  },
  {
    title: "New",
    href: "/new",
    icon: PencilEdit02Icon,
    match: (pathname: string) => pathname === "/new",
  },
];

const recentWorkspaces = sampleWorkspaces.map((workspace) => ({
  title: workspace.title,
  href: `/workspaces/${workspace.slug}`,
}));

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();
  const activeRecentWorkspace = recentWorkspaces.find(
    (item) => pathname === item.href,
  );

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-zinc-950/10 bg-[#f6f1e8] text-zinc-950"
      style={
        {
          "--sidebar": "#f6f1e8",
          "--sidebar-foreground": "#18181b",
          "--sidebar-accent": "rgba(24,24,27,0.06)",
          "--sidebar-accent-foreground": "#18181b",
          "--sidebar-border": "rgba(24,24,27,0.08)",
          "--sidebar-ring": "rgba(24,24,27,0.12)",
        } as React.CSSProperties
      }
      {...props}
    >
      <SidebarHeader className="border-b border-zinc-950/10 px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/workspaces"
            className="flex min-w-0 items-center gap-3 px-2 py-1.5 transition-colors hover:bg-zinc-950/5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          >
            <div className="flex size-8 items-center justify-center overflow-hidden ">
              <Image
                src="/logo.png"
                alt="PlanWiki logo"
                width={28}
                height={28}
                className="size-7 object-contain"
              />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-medium text-zinc-950">
                PlanWiki
              </p>
              <p className="truncate text-xs text-zinc-500">Workspace shell</p>
            </div>
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-zinc-500 hover:bg-zinc-950/5 hover:text-zinc-950 group-data-[collapsible=icon]:hidden"
            onClick={toggleSidebar}
          >
            <HugeiconsIcon icon={SidebarLeftIcon} className="size-4" />
            <span className="sr-only">
              {state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
            </span>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu className="gap-1.5">
          {mainNav.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={
                  item.href === "/workspaces"
                    ? item.match(pathname) && !activeRecentWorkspace
                    : item.match(pathname)
                }
                tooltip={item.title}
                className="h-11 px-3 text-sm text-zinc-600 hover:bg-zinc-950/5 hover:text-zinc-950 data-[active=true]:bg-zinc-950/5 data-[active=true]:text-zinc-950 data-[active=true]:shadow-none"
              >
                <Link href={item.href}>
                  <HugeiconsIcon icon={item.icon} className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <SidebarGroup className="mt-4 px-0">
          <SidebarGroupLabel className="px-3">Recents</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentWorkspaces.map((workspace) => {
                const isActive = pathname === workspace.href;

                return (
                  <SidebarMenuItem key={workspace.href} className="group/item">
                    <div className="flex w-full items-center gap-1">
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={workspace.title}
                        className="h-10 flex-1 px-3 text-sm text-zinc-600 hover:bg-zinc-950/5 hover:text-zinc-950 data-[active=true]:bg-zinc-950/5 data-[active=true]:text-zinc-950"
                      >
                        <Link href={workspace.href}>
                          <HugeiconsIcon
                            icon={FolderShared01Icon}
                            className="size-4"
                          />
                          <span className="truncate">/{workspace.title}</span>
                        </Link>
                      </SidebarMenuButton>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover/item:opacity-100 group-data-[collapsible=icon]:hidden"
                          >
                            <HugeiconsIcon
                              icon={MoreHorizontalIcon}
                              className="size-4 text-zinc-500"
                            />
                            <span className="sr-only">Workspace actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          side="right"
                          className="min-w-48 border-zinc-950/10 bg-white"
                        >
                          <DropdownMenuItem className="flex items-center gap-2">
                            <HugeiconsIcon
                              icon={Edit02Icon}
                              className="size-4"
                            />
                            Rename Workspace
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            className="flex items-center gap-2"
                          >
                            <HugeiconsIcon
                              icon={Delete02Icon}
                              className="size-4 text-red-600"
                            />
                            Delete Workspace
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-950/10 px-3 py-4">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
