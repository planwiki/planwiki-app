"use client";

import * as React from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChatBotIcon,
  Delete02Icon,
  FolderShared01Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  SidebarLeftIcon,
  BotIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NavUser } from "@/components/nav-user";
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
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

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
  {
    title: "Agents",
    href: "/agents",
    icon: BotIcon,
    match: (pathname: string) => pathname === "/agents",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, toggleSidebar } = useSidebar();
  const utils = trpc.useUtils();
  const { data: recentWorkspaces = [], isLoading } =
    trpc.workspaces.list.useQuery();
  const [workspaceToDelete, setWorkspaceToDelete] = React.useState<{
    id: string;
    slug: string;
    title: string;
  } | null>(null);
  const [workspaceToRename, setWorkspaceToRename] = React.useState<{
    id: string;
    slug: string;
    title: string;
  } | null>(null);
  const [nextTitle, setNextTitle] = React.useState("");
  const activeRecentWorkspace = recentWorkspaces.find(
    (item) => pathname === `/workspaces/${item.slug}`,
  );
  const deleteWorkspace = trpc.workspaces.deleteWorkspace.useMutation({
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error("We could not delete that workspace.");
        return;
      }

      await utils.workspaces.list.invalidate();
      await utils.workspaces.getBySlug.invalidate();
      toast.success("Workspace deleted.");

      if (pathname === `/workspaces/${result.data.slug}`) {
        router.replace("/workspaces");
        router.refresh();
      }
    },
    onError: () => {
      toast.error("We could not delete that workspace.");
    },
  });
  const renameWorkspace = trpc.workspaces.renameWorkspace.useMutation({
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error("We could not rename that workspace.");
        return;
      }

      await utils.workspaces.list.invalidate();
      await utils.workspaces.getBySlug.invalidate();
      toast.success("Workspace renamed.");

      if (pathname === `/workspaces/${result.data.slug}`) {
        router.refresh();
      }
    },
    onError: () => {
      toast.error("We could not rename that workspace.");
    },
  });

  const handleRenameOpen = (workspace: {
    id: string;
    slug: string;
    title: string;
  }) => {
    setWorkspaceToRename(workspace);
    setNextTitle(workspace.title);
  };

  const handleRenameConfirm = async () => {
    if (!workspaceToRename || !nextTitle.trim()) {
      return;
    }

    await renameWorkspace.mutateAsync({
      workspaceId: workspaceToRename.id,
      title: nextTitle.trim(),
    });

    setWorkspaceToRename(null);
    setNextTitle("");
  };

  const handleDeleteConfirm = async () => {
    if (!workspaceToDelete) {
      return;
    }

    await deleteWorkspace.mutateAsync({
      workspaceId: workspaceToDelete.id,
    });

    setWorkspaceToDelete(null);
  };

  return (
    <>
      <Dialog
        open={Boolean(workspaceToRename)}
        onOpenChange={(open) => {
          if (!open) {
            setWorkspaceToRename(null);
            setNextTitle("");
          }
        }}
      >
        <DialogContent className="rounded-sm border border-zinc-950/10 bg-[#f6f1e8] p-0 shadow-none ring-0">
          <DialogHeader className="border-b border-zinc-950/10 px-5 py-5">
            <DialogTitle className="text-lg font-semibold tracking-[-0.03em] text-zinc-950">
              Rename workspace
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 text-zinc-600">
              Update the title shown in your workspace list and header.
            </DialogDescription>
          </DialogHeader>
          <div className="px-5 py-5">
            <Input
              value={nextTitle}
              onChange={(event) => setNextTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && nextTitle.trim()) {
                  void handleRenameConfirm();
                }
              }}
              placeholder="Workspace title"
              className="h-11 rounded-sm border-zinc-950/10 bg-white shadow-none"
            />
          </div>
          <DialogFooter className="border-t border-zinc-950/10 px-5 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setWorkspaceToRename(null);
                setNextTitle("");
              }}
              className="rounded-sm border-zinc-950/15 bg-white px-4 text-zinc-700 shadow-none hover:bg-[#f7f2ea]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleRenameConfirm()}
              disabled={!nextTitle.trim() || renameWorkspace.isPending}
              className="rounded-sm border-zinc-950 bg-zinc-950 px-4 text-[#f6f1e8] hover:bg-zinc-800"
            >
              {renameWorkspace.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(workspaceToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setWorkspaceToDelete(null);
          }
        }}
      >
        <DialogContent className="rounded-sm border border-zinc-950/10 bg-[#f6f1e8] p-0 shadow-none ring-0">
          <DialogHeader className="px-5 py-5">
            <DialogTitle className="text-lg font-semibold tracking-[-0.03em] text-zinc-950">
              Delete workspace
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 text-zinc-600">
              This will permanently remove{" "}
              {workspaceToDelete?.title ?? "this workspace"}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="px-5 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setWorkspaceToDelete(null)}
              className="rounded-sm border-zinc-950/15 bg-white px-4 text-zinc-700 shadow-none hover:bg-[#f7f2ea]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleDeleteConfirm()}
              disabled={deleteWorkspace.isPending}
              className="rounded-sm border border-red-700 bg-red-700 px-4 text-white hover:bg-red-800"
            >
              {deleteWorkspace.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            {state === "collapsed" ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-8 text-zinc-500 hover:bg-zinc-950/5 hover:text-zinc-950"
                onClick={toggleSidebar}
              >
                <HugeiconsIcon icon={SidebarLeftIcon} className="size-4" />
                <span className="sr-only">Open sidebar</span>
              </Button>
            ) : (
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
                  <p className="truncate text-xs text-zinc-500">
                    Interactive Workspaces
                  </p>
                </div>
              </Link>
            )}

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
                {isLoading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <SidebarMenuItem key={index}>
                        <div className="px-3 py-1">
                          <Skeleton className="h-10 rounded-sm bg-zinc-950/8" />
                        </div>
                      </SidebarMenuItem>
                    ))
                  : recentWorkspaces?.map((workspace) => {
                      const href = `/workspaces/${workspace.slug}`;
                      const isActive = pathname === href;
                      const workspaceLabel =
                        workspace.title ?? "Untitled workspace";

                      return (
                        <SidebarMenuItem
                          key={workspace.id}
                          className="group/item"
                        >
                          <div className="flex w-full items-center gap-1">
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              tooltip={workspace.title}
                              className="h-10 flex-1 px-3 text-sm text-zinc-600 hover:bg-zinc-950/5 hover:text-zinc-950 data-[active=true]:bg-zinc-950/5 data-[active=true]:text-zinc-950"
                            >
                              <Link href={href}>
                                <HugeiconsIcon
                                  icon={FolderShared01Icon}
                                  className="size-4"
                                />
                                <span className="truncate">
                                  /{workspace.title}
                                </span>
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
                                  <span className="sr-only">
                                    Workspace actions
                                  </span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                side="right"
                                className="min-w-48 border-zinc-950/10 bg-white"
                              >
                                <DropdownMenuItem
                                  className="flex items-center gap-2"
                                  onSelect={() =>
                                    handleRenameOpen({
                                      id: workspace.id,
                                      slug: workspace.slug,
                                      title: workspaceLabel,
                                    })
                                  }
                                >
                                  <HugeiconsIcon
                                    icon={BotIcon}
                                    className="size-4"
                                  />
                                  Rename Workspace
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  variant="destructive"
                                  className="flex items-center gap-2"
                                  onSelect={() =>
                                    setWorkspaceToDelete({
                                      id: workspace.id,
                                      slug: workspace.slug,
                                      title: workspaceLabel,
                                    })
                                  }
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

                {!isLoading && !recentWorkspaces?.length ? (
                  <SidebarMenuItem>
                    <div className="px-3 py-2 text-sm text-zinc-500">
                      No workspaces yet.
                    </div>
                  </SidebarMenuItem>
                ) : null}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-zinc-950/10 px-3 py-4">
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
