"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type KeyboardEvent,
} from "react";

import { SentIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function NewWorkspaceChat() {
  const { data: session } = authClient.useSession();
  const user = session?.user ?? null;
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 96), 240)}px`;
  }, [input]);

  const canSubmit = useMemo(
    () => input.trim().length > 0 && !isPending,
    [input, isPending],
  );

  const rawUserName =
    (
      user?.name ||
      user?.email?.split("@")[0] ||
      "there"
    )?.trim() || "there";
  const firstName = rawUserName.split(" ")[0] || "there";

  const handleSubmit = () => {
    const text = input.trim();
    if (!text) return;

    startTransition(() => {
      console.log("Submitted plan:", text);
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#f6f1e8]">
      <section className="flex flex-1 items-center justify-center px-4 py-10 md:px-6">
        <div className="mx-auto w-full max-w-5xl">
          <div className="text-center">
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-zinc-950 md:text-6xl">
              Welcome, {firstName}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-700 md:text-[15px]">
              Bring in the plan you already have and turn it into a workspace.
              Paste AI output below.
            </p>
          </div>

          <div className="mt-10 border border-zinc-950/10 bg-[#f7f2ea] p-4 md:p-5">
            <div className="border border-zinc-950/10 bg-white p-3">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste the plan you already have."
                className="min-h-24 resize-none rounded-none border-none bg-transparent px-0 py-0 text-base leading-7 text-zinc-800 shadow-none focus-visible:border-none focus-visible:ring-0 md:text-[15px]"
                aria-label="Workspace chat input"
              />

              <div className="mt-3 flex flex-col gap-3 border-t border-zinc-950/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-zinc-500">
                  Enter to send. Shift+Enter for a new line.
                </p>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="h-10 rounded-none border-zinc-950 bg-zinc-950 px-4 text-[#f6f1e8] hover:bg-zinc-800"
                >
                  Send
                  <HugeiconsIcon icon={SentIcon} className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
