"use client"

import { useEffect, useMemo, useState } from "react"
import { Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

interface WorkspaceShareControlsProps {
  slug: string
}

export function WorkspaceShareControls({
  slug,
}: WorkspaceShareControlsProps) {
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState("http://localhost:3000")

  const sharedUrl = useMemo(() => {
    return `${origin}/workspaces/${slug}/shared/public`
  }, [origin, slug])

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.origin) {
      setOrigin(window.location.origin)
    }
  }, [])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sharedUrl)
    setCopied(true)

    window.setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  return (
    <div className="flex items-center gap-2 self-start justify-self-start md:justify-self-end">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            className="h-10 rounded-none border-zinc-950 bg-zinc-950 px-4 text-[#f6f1e8] hover:bg-zinc-800"
          >
            <span>Share</span>
            <Share2 className="size-4" />
          </Button>
        </DialogTrigger>

        <DialogContent className="rounded-none border border-zinc-950/10 bg-[#f6f1e8] p-0 shadow-none ring-0">
          <DialogHeader className="border-b border-zinc-950/10 px-5 py-5">
            <DialogTitle className="text-lg font-semibold tracking-[-0.03em] text-zinc-950">
              Share workspace
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 text-zinc-600">
              Publish a public link for this workspace and share it with other
              people.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-5 py-5">
            <div className="border border-zinc-950/10 bg-white px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                Public URL
              </p>
              <p className="mt-2 break-all text-sm text-zinc-950">
                {sharedUrl}
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 border border-zinc-950/10 bg-white px-4 py-3">
              <div>
                <p className="text-sm font-medium text-zinc-950">Public</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Anyone with the link can view this workspace.
                </p>
              </div>
              <Switch
                checked
                disabled
                aria-label="Toggle public sharing"
                className="border-zinc-950/20 data-[unchecked]:bg-white data-[checked]:bg-zinc-950"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-zinc-950/10 px-5 py-4">
            <Button
              type="button"
              onClick={handleCopy}
              className="rounded-none border-zinc-950 bg-zinc-950 px-4 text-[#f6f1e8] hover:bg-zinc-800"
            >
              {copied ? "Copied" : "Copy link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
