"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
  Logout01Icon,
  MoreHorizontalIcon,
  Settings02Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const avatarColors = [
  "bg-rose-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-fuchsia-500",
  "bg-cyan-500",
]

function getAvatarColor(name: string) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length] ?? avatarColors[0]
}

export function NavUser() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const userName =
    (
      ((session?.user as any)?.name as string) ||
      session?.user?.email?.split("@")[0] ||
      "User"
    )?.trim() || "User"
  const userEmail = session?.user?.email || ""
  const avatarImage = (session?.user as { image?: string })?.image ?? null
  const avatarInitial = (userName[0] || "U").toUpperCase()
  const avatarColor = getAvatarColor(userName)
  const isPending = status === "loading"
  const hasUser = Boolean(session?.user)

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-12 px-3 text-zinc-950 hover:bg-zinc-950/5 hover:text-zinc-950 data-[state=open]:bg-zinc-950/5 data-[state=open]:text-zinc-950"
            >
              <Avatar className="size-8">
                {avatarImage ? (
                  <AvatarImage src={avatarImage} alt={userName} />
                ) : null}
                <AvatarFallback
                  className={cn(
                    "font-semibold text-white",
                    avatarColor,
                  )}
                >
                  {avatarInitial}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-medium text-zinc-950">
                  {isPending ? "Loading account..." : userName}
                </span>
                <span className="truncate text-xs text-zinc-500">
                  {isPending ? "Checking session" : userEmail || "No email"}
                </span>
              </div>

              <HugeiconsIcon
                icon={MoreHorizontalIcon}
                className="ml-auto size-4 text-zinc-500 group-data-[collapsible=icon]:hidden"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-64 border-zinc-950/10 bg-white p-1.5"
            side="right"
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="px-2 py-2">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  {avatarImage ? (
                    <AvatarImage src={avatarImage} alt={userName} />
                  ) : null}
                  <AvatarFallback
                    className={cn(
                      "font-semibold text-white",
                      avatarColor,
                    )}
                  >
                    {avatarInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-950">
                    {userName}
                  </p>
                  <p className="truncate text-xs text-zinc-500">{userEmail}</p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {hasUser ? (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/workspaces" className="flex items-center gap-2">
                    <HugeiconsIcon icon={UserCircleIcon} className="size-4" />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/new" className="flex items-center gap-2">
                    <HugeiconsIcon icon={Settings02Icon} className="size-4" />
                    Preferences
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <HugeiconsIcon icon={Logout01Icon} className="size-4" />
                  Log out
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <HugeiconsIcon icon={Logout01Icon} className="size-4" />
                Log out
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
