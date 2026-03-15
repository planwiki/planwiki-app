"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"

const MIN_PLAN_LENGTH = 50

interface WorkspaceUpdateSheetProps {
  isOpen: boolean
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (value: string) => Promise<void>
}

export function WorkspaceUpdateSheet({
  isOpen,
  isPending,
  onOpenChange,
  onSubmit,
}: WorkspaceUpdateSheetProps) {
  const [input, setInput] = useState("")
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async () => {
    const text = input.trim()

    if (text.length < MIN_PLAN_LENGTH) {
      setValidationMessage(
        "Your update is too short. Paste more detail before sending it.",
      )
      return
    }

    setValidationMessage(null)
    setErrorMessage(null)

    try {
      await onSubmit(text)
      setInput("")
      onOpenChange(false)
    } catch {
      setErrorMessage(
        "We could not update the workspace yet. Try again with a little more detail.",
      )
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full rounded-none border-zinc-950/10 bg-[#f7f2ea] p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b border-zinc-950/10 px-5 py-5 md:px-6">
          <SheetTitle className="text-left text-xl font-semibold tracking-[-0.03em] text-zinc-950">
            Update workspace
          </SheetTitle>
          <SheetDescription className="text-left leading-6 text-zinc-600">
            Paste a revised plan or a clear instruction. The current widgets and
            message history will be used as context before the workspace is rebuilt.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 px-5 py-5 md:px-6">
          <Textarea
            value={input}
            onChange={(event) => {
              setInput(event.target.value)
              if (validationMessage) {
                setValidationMessage(null)
              }
              if (errorMessage) {
                setErrorMessage(null)
              }
            }}
            placeholder="Paste updated AI output or describe how this workspace should change."
            className="min-h-[260px] resize-none rounded-none border-zinc-950/10 bg-white text-base leading-7 text-zinc-800 shadow-none focus-visible:ring-0 md:min-h-[320px]"
            aria-label="Workspace update input"
            disabled={isPending}
          />

          {validationMessage ? (
            <p className="text-sm leading-6 text-[#8d3b28]">{validationMessage}</p>
          ) : null}

          {errorMessage ? (
            <p className="text-sm leading-6 text-[#8d3b28]">{errorMessage}</p>
          ) : null}
        </div>

        <SheetFooter className="border-t border-zinc-950/10 px-5 py-4 md:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-none border-zinc-950/15 bg-white px-4 text-zinc-700 shadow-none hover:bg-[#f3ede3]"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => void handleSubmit()}
            className="h-11 rounded-none border-zinc-950 bg-zinc-950 px-4 text-[#f6f1e8] hover:bg-zinc-800"
            disabled={isPending}
          >
            {isPending ? "Updating workspace..." : "Update workspace"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
