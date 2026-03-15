"use client"

import { useEffect, useMemo, useState } from "react"
import { Share2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { trpc } from "@/lib/trpc"

interface WorkspaceShareControlsProps {
  workspaceId: string
  slug: string
  isPublic?: boolean
}

export function WorkspaceShareControls({
  workspaceId,
  slug,
  isPublic = false,
}: WorkspaceShareControlsProps) {
  const [origin, setOrigin] = useState("http://localhost:3000")
  const [hasShared, setHasShared] = useState(isPublic)
  const setWorkspaceVisibility = trpc.workspaces.setWorkspaceVisibility.useMutation()

  const sharedUrl = useMemo(() => {
    return `${origin}/workspaces/${slug}/shared/public`
  }, [origin, slug])

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.origin) {
      setOrigin(window.location.origin)
    }
  }, [])

  useEffect(() => {
    setHasShared(isPublic)
  }, [isPublic])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sharedUrl)
    toast.success("Link copied")
  }

  const handleVisibilityChange = async (checked: boolean) => {
    setHasShared(checked)

    try {
      const result = await setWorkspaceVisibility.mutateAsync({
        workspaceId,
        isPublic: checked,
      })

      if (!result.success) {
        setHasShared(!checked)
        toast.error("We could not update sharing.")
        return
      }

      setHasShared(result.data.isPublic)
    } catch {
      setHasShared(!checked)
      toast.error("We could not update sharing.")
    }
  }

  return (
    <div className="flex w-full flex-col gap-2 self-start justify-self-start sm:flex-row sm:items-center md:w-auto md:justify-self-end">
      <div className="flex h-10 items-center justify-between border border-zinc-950/10 bg-[#f7f2ea] px-3 sm:min-w-36 sm:justify-start sm:gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
          Public
        </span>
        <Switch
          checked={hasShared}
          onCheckedChange={(checked) => void handleVisibilityChange(checked)}
          disabled={setWorkspaceVisibility.isPending}
          aria-label="Toggle public sharing"
          className="data-checked:bg-zinc-950"
        />
      </div>
      <Button
        type="button"
        onClick={() => void handleCopy()}
        disabled={!hasShared || setWorkspaceVisibility.isPending}
        className="h-10 w-full rounded-none border-zinc-950 bg-zinc-950 px-4 text-[#f6f1e8] hover:bg-zinc-800 md:w-auto"
      >
        <span>Copy link</span>
        <Share2 className="size-4" />
      </Button>
    </div>
  )
}
