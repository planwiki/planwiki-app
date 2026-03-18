"use client";

import {
  Cancel01Icon,
  Delete02Icon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import {
  PromptInput,
  PromptInputProvider,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";

interface WorkspaceChatSidebarProps {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (value: string) => Promise<void>;
}

export function WorkspaceChatSidebar({
  isOpen,
  isPending,
  onClose,
  onSubmit,
}: WorkspaceChatSidebarProps) {
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const text = input.trim();
    if (!text) return;

    setErrorMessage(null);

    try {
      await onSubmit(text);
      setInput("");
    } catch {
      setErrorMessage(
        "We could not update the workspace yet. Try again with a bit more detail.",
      );
    }
  };

  const suggestions = [
    "Add more tasks related to this plan.",
    "Remove anything that feels duplicated.",
    "Make this clearer for execution.",
    "Break this into smaller next steps.",
  ];

  return (
    <PromptInputProvider initialInput={input}>
      <div className="flex w-80 shrink-0 flex-col border-l border-zinc-950/10 bg-[#f6f1e8] text-zinc-700 transition-all duration-300 lg:w-[420px]">
        <div className="flex items-center justify-between border-b border-zinc-950/10 px-5 py-4 text-sm font-medium text-zinc-950">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              Workspace chat
            </p>
            <span className="mt-1 block">Refine this workspace</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-500">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-sm hover:bg-zinc-950/5 hover:text-zinc-950"
              onClick={() => setInput("")}
            >
              <HugeiconsIcon icon={Delete02Icon} className="size-4" />
              <span className="sr-only">Clear</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-sm hover:bg-zinc-950/5 hover:text-zinc-950"
              onClick={onClose}
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-end overflow-y-auto p-5">
          {errorMessage && (
            <div className="mb-4 rounded-sm border border-[#8d3b28]/20 bg-[#f4dfda] px-3 py-2 text-sm text-[#8d3b28]">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setInput(suggestion);
                }}
                disabled={isPending}
                className="w-fit rounded-sm border border-zinc-950/10 bg-white px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:border-zinc-950/20 hover:bg-[#faf8f3] hover:text-zinc-950 disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-950/10 px-5 py-5">
          <p className="mb-4 flex items-center gap-1.5 text-sm text-zinc-500">
            Tip: You can open and close chat with{" "}
            <kbd className="flex h-5 items-center rounded-sm border border-zinc-950/15 bg-white px-1 font-sans text-xs text-zinc-950">
              ⌘
            </kbd>{" "}
            <kbd className="flex h-5 items-center rounded-sm border border-zinc-950/15 bg-white px-1.5 font-sans text-xs text-zinc-950">
              I
            </kbd>
          </p>

          <PromptInput
            onSubmit={async (_message) => {
              await handleSubmit();
            }}
            className="relative flex flex-col rounded-sm bg-white border border-zinc-950/10 shadow-sm focus-within:ring-1 focus-within:ring-zinc-950 focus-within:border-zinc-950 transition-all"
          >
            <PromptInputTextarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isPending}
              placeholder="Describe how you want to update this workspace."
              className="min-h-28 w-full resize-none rounded-sm border-none bg-transparent p-3 pb-12 text-[15px] leading-7 text-zinc-700 placeholder:text-zinc-500 shadow-none ring-0 focus-visible:outline-none focus-visible:ring-0 md:min-h-32"
            />
            <div className="absolute bottom-2 right-2">
              <Button
                type="submit"
                size="icon"
                disabled={isPending || !input.trim()}
                className="h-8 w-8 rounded-sm bg-zinc-950 text-white shadow-none hover:bg-zinc-800 disabled:opacity-50"
              >
                {isPending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-white" />
                ) : (
                  <HugeiconsIcon icon={SentIcon} className="size-4" />
                )}
              </Button>
            </div>
          </PromptInput>
        </div>
      </div>
    </PromptInputProvider>
  );
}
