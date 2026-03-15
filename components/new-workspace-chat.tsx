"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";

import { SentIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";

const MIN_PLAN_LENGTH = 50

export function NewWorkspaceChat() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user ?? null;
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"compose" | "loading" | "error">("compose");
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const generateWorkspace = trpc.workspaces.generateNewWorkspace.useMutation();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 96), 240)}px`;
  }, [input, phase]);

  const canSubmit = useMemo(
    () => input.trim().length > 0 && !generateWorkspace.isPending,
    [generateWorkspace.isPending, input],
  );

  const rawUserName =
    (user?.name || user?.email?.split("@")[0] || "there")?.trim() || "there";
  const firstName = rawUserName.split(" ")[0] || "there";

  const handleSubmit = async () => {
    const text = input.trim();
    if (!text) return;

    if (text.length < MIN_PLAN_LENGTH) {
      setValidationMessage(
        "Your plan is too short. Paste more detail before generating a workspace.",
      );
      return;
    }

    setValidationMessage(null);
    setErrorMessage(null);
    setPhase("loading");

    try {
      const result = await generateWorkspace.mutateAsync({
        text,
        source: "new-workspace",
      });

      if (!result.success || !result.data.slug) {
        setErrorMessage(
          "We could not generate that workspace yet. Try again with a little more detail.",
        );
        setPhase("error");
        return;
      }

      router.push(`/workspaces/${result.data.slug}`);
      router.refresh();
    } catch {
      setErrorMessage(
        "We could not generate that workspace yet. Try again with a little more detail.",
      );
      setPhase("error");
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#f6f1e8]">
      <section className="flex flex-1 items-center justify-center px-4 py-8 sm:py-10 md:px-6">
        <div className="mx-auto w-full max-w-4xl">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              New workspace
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-5xl md:text-6xl">
              Welcome, {firstName}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-700 md:text-[15px]">
              Bring in the plan you already have and turn it into a workspace.
              Paste AI output below.
            </p>
          </div>

          <div className="mt-8 border border-zinc-950/10 bg-[#f7f2ea] p-4 md:mt-10 md:p-5">
            <div className="border border-zinc-950/10 bg-white p-3">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  if (validationMessage) {
                    setValidationMessage(null);
                  }
                  if (errorMessage) {
                    setErrorMessage(null);
                  }
                  if (phase === "error") {
                    setPhase("compose");
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Paste the plan you already have."
                className="min-h-24 resize-none rounded-none border-none bg-transparent px-0 py-0 text-base leading-7 text-zinc-800 shadow-none focus-visible:border-none focus-visible:ring-0 md:text-[15px]"
                aria-label="Workspace chat input"
                disabled={phase === "loading"}
              />

              {validationMessage ? (
                <p className="mt-3 text-sm leading-6 text-[#8d3b28]">
                  {validationMessage}
                </p>
              ) : null}

              {phase === "error" && errorMessage ? (
                <p className="mt-3 text-sm leading-6 text-[#8d3b28]">
                  {errorMessage}
                </p>
              ) : null}

              <div className="mt-3 flex flex-col gap-3 border-t border-zinc-950/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md text-xs leading-6 text-zinc-500">
                  Enter to send. Shift+Enter for a new line.
                </p>
                <Button
                  type="button"
                  onClick={() => void handleSubmit()}
                  disabled={!canSubmit}
                  className="h-11 w-full rounded-none border-zinc-950 bg-zinc-950 px-4 text-[#f6f1e8] hover:bg-zinc-800 sm:w-auto"
                >
                  {phase === "loading" ? "Generating..." : "Generate Workspace"}
                  <HugeiconsIcon
                    icon={SentIcon}
                    className={`size-4 ${phase === "loading" ? "animate-pulse" : ""}`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
