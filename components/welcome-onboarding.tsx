"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { ArrowRight } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { WorkspaceWidgetRenderer } from "@/components/widgets/workspace-widget-renderer"
import { trpc } from "@/lib/trpc"
import type { WorkspaceWidget } from "@/lib/widgets/widget-registry"

const samplePlans = [
  {
    id: "startup-launch",
    label: "Startup Launch Plan",
    text: `Startup Launch Plan

Phase 1: Finalize positioning, tighten the landing page headline, and prepare launch visuals.
Phase 2: Build the public waitlist, record a short demo, and collect three testimonials.
Week 1: Publish the launch thread, submit to Product Hunt, and reply to every early comment.
Week 2: Gather feedback, fix onboarding friction, and invite the next ten users.

Budget: $1,200 total
Marketing spend: $300 for launch content and distribution
Tools: $120 for design, analytics, and email tooling

1. Write launch copy
2. Record walkthrough video
3. Schedule announcement posts
4. Track signups and bugs
5. Share the public workspace link`,
  },
  {
    id: "budget-plan",
    label: "Budget Plan",
    text: `Personal Budget Plan

Month 1: Review recurring costs, reduce unnecessary subscriptions, and build a weekly spending check.
Month 2: Allocate savings automatically, set grocery limits, and create an emergency fund contribution.
Month 3: Audit progress, rebalance category caps, and prepare the next quarter plan.

Rent: $650
Groceries: $180
Transport: $70
Tools and subscriptions: $45
Emergency fund: $150

1. Track every expense weekly
2. Cut duplicate subscriptions
3. Move savings on payday
4. Review spending every Sunday`,
  },
  {
    id: "study-plan",
    label: "Study Plan",
    text: `Study Plan for Final Exams

Day 1: List every exam topic, sort by confidence level, and block the week by subject.
Day 2: Review biology notes, complete two chemistry practice sets, and summarize weak areas.
Day 3: Focus on math problem drills, revise formulas, and test under timed conditions.
Day 4: Run a mock exam, check mistakes, and rewrite short memory notes.

Materials: lecture slides, past papers, flashcards
Target score: 85%
Revision time: 2 hours per evening

1. Build a revision checklist
2. Finish one timed paper per subject
3. Track weak topics in a table
4. Review mistakes before sleep`,
  },
] as const

const MIN_PLAN_LENGTH = 50

type WelcomeOnboardingProps = {
  userName?: string | null
  userEmail?: string | null
}

type GeneratedWorkspaceState = {
  title: string
  summary: string
  widgets: WorkspaceWidget[]
  workspaceId?: string
  slug?: string
}

export function WelcomeOnboarding({
  userName,
  userEmail,
}: WelcomeOnboardingProps) {
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [input, setInput] = useState("")
  const [selectedSampleId, setSelectedSampleId] = useState<
    (typeof samplePlans)[number]["id"] | null
  >(null)
  const [phase, setPhase] = useState<
    "compose" | "loading" | "preview" | "error"
  >("compose")
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [generated, setGenerated] = useState<GeneratedWorkspaceState | null>(
    null,
  )
  const [widgets, setWidgets] = useState<WorkspaceWidget[]>([])
  const [selectedTableRows, setSelectedTableRows] = useState<
    Record<string, number[]>
  >({})

  const generateWorkspace = trpc.workspaces.generateNewWorkspace.useMutation()

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 200), 420)}px`
  }, [input, phase])

  const rawUserName =
    (
      userName ||
      userEmail?.split("@")[0] ||
      "there"
    )?.trim() || "there"
  const firstName = rawUserName.split(" ")[0] || "there"

  const canGenerate = useMemo(
    () => input.trim().length > 0 && !generateWorkspace.isPending,
    [generateWorkspace.isPending, input],
  )

  const handleSampleSelect = (sampleId: (typeof samplePlans)[number]["id"]) => {
    const sample = samplePlans.find((item) => item.id === sampleId)
    if (!sample) return

    setSelectedSampleId(sampleId)
    setInput(sample.text)
    setValidationMessage(null)
    setErrorMessage(null)

    if (phase === "error") {
      setPhase("compose")
    }
  }

  const handleGenerate = async () => {
    const text = input.trim()

    if (!text) return

    if (text.length < MIN_PLAN_LENGTH) {
      setValidationMessage(
        "Your plan is too short. Paste more detail before generating a workspace.",
      )
      return
    }

    setValidationMessage(null)
    setErrorMessage(null)
    setGenerated(null)
    setWidgets([])
    setSelectedTableRows({})
    setPhase("loading")

    try {
      const result = await generateWorkspace.mutateAsync({
        text,
        source: "welcome-onboarding",
      })

      if (!result.success) {
        setErrorMessage(
          "We could not assemble that workspace yet. Try again and paste a little more detail.",
        )
        setPhase("error")
        return
      }

      const nextGenerated = {
        ...result.data,
        widgets: [...result.data.widgets].sort(
          (left, right) => left.order - right.order,
        ),
      }

      if (nextGenerated.slug) {
        router.push(`/workspaces/${nextGenerated.slug}`)
        router.refresh()
        return
      }

      setGenerated(nextGenerated)
      setWidgets(nextGenerated.widgets)
      setSelectedTableRows({})
      setPhase("preview")
    } catch {
      setErrorMessage(
        "We could not assemble that workspace yet. Try again and paste a little more detail.",
      )
      setPhase("error")
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      void handleGenerate()
    }
  }

  const handleChecklistItemToggle = (widgetId: string, itemId: string) => {
    setWidgets((currentWidgets) =>
      currentWidgets.map((widget) => {
        if (widget.id !== widgetId || widget.type !== "checklist") {
          return widget
        }

        return {
          ...widget,
          items: widget.items.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item,
          ),
        }
      }),
    )
  }

  const handleTableRowToggle = (widgetId: string, rowIndex: number) => {
    setSelectedTableRows((current) => {
      const existing = current[widgetId] ?? []
      const nextRows = existing.includes(rowIndex)
        ? existing.filter((index) => index !== rowIndex)
        : [...existing, rowIndex]

      return {
        ...current,
        [widgetId]: nextRows,
      }
    })
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#f6f1e8]">
      <section className="flex flex-1 justify-center px-4 py-8 sm:py-10 md:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="animate-in fade-in slide-in-from-bottom-4 text-center duration-500 motion-reduce:animate-none">
            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              Welcome
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-5xl md:text-6xl">
              Try an example now
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-700 md:text-[15px]">
              Welcome, {firstName}. Pick a sample plan to load the raw AI text,
              then preview how PlanWiki turns it into a workspace.
            </p>
          </div>

          {phase === "compose" || phase === "error" ? (
            <div className="animate-in fade-in slide-in-from-bottom-5 mx-auto w-full max-w-5xl duration-500 motion-reduce:animate-none">
              <div className="border border-zinc-950/10 bg-[#f7f2ea] p-4 md:p-5">
                <div
                  className={`border border-zinc-950/10 p-3 md:p-4 ${
                    phase === "error" ? "bg-[#fff7f4]" : "bg-white"
                  }`}
                >
                  <div className="flex gap-2 overflow-x-auto border-b border-zinc-950/10 pb-3">
                    {samplePlans.map((sample) => {
                      const isSelected = sample.id === selectedSampleId

                      return (
                        <button
                          key={sample.id}
                          type="button"
                          onClick={() => handleSampleSelect(sample.id)}
                          className={`shrink-0 border px-3 py-2 text-xs uppercase tracking-[0.22em] transition-[transform,colors] duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                            isSelected
                              ? "border-zinc-950 bg-zinc-950 text-[#f6f1e8]"
                              : "border-zinc-950/10 bg-[#f7f2ea] text-zinc-600 hover:border-zinc-950 hover:bg-white hover:text-zinc-950"
                          }`}
                        >
                          {sample.label}
                        </button>
                      )
                    })}
                  </div>

                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(event) => {
                      setInput(event.target.value)
                      if (validationMessage) {
                        setValidationMessage(null)
                      }
                      if (errorMessage) {
                        setErrorMessage(null)
                      }
                      if (phase === "error") {
                        setPhase("compose")
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Pick a sample plan to load its AI-generated text."
                    className="mt-3 min-h-52 resize-none rounded-none border-none bg-transparent px-0 py-0 text-base leading-7 text-zinc-800 shadow-none focus-visible:border-none focus-visible:ring-0 md:text-[15px]"
                    aria-label="Onboarding plan input"
                  />

                  {validationMessage ? (
                    <p className="mt-3 text-sm leading-6 text-[#8d3b28]">
                      {validationMessage}
                    </p>
                  ) : null}

                  {phase === "error" && errorMessage ? (
                    <div className="mt-4 border border-[#d8b3a8] bg-[#fffdfb] px-4 py-4">
                      <p className="text-sm leading-6 text-[#8d3b28]">
                        {errorMessage}
                      </p>
                      <div className="mt-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setPhase("compose")
                            setErrorMessage(null)
                            setGenerated(null)
                            setWidgets([])
                            setSelectedTableRows({})
                          }}
                          className="h-10 rounded-none border-zinc-950/15 bg-white px-4 text-zinc-700 shadow-none hover:bg-[#f7f2ea]"
                        >
                          Try again
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-3 flex flex-col gap-3 border-t border-zinc-950/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-md text-xs leading-6 text-zinc-500">
                      Pick a sample plan to inspect the raw AI text, then generate
                      the workspace preview.
                    </p>
                    <Button
                      type="button"
                      onClick={() => void handleGenerate()}
                      disabled={!canGenerate}
                      className="h-11 w-full rounded-none border-zinc-950 bg-zinc-950 px-4 text-[#f6f1e8] hover:bg-zinc-800 sm:w-auto"
                    >
                      Generate Workspace
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {phase === "loading" ? (
            <div className="animate-in fade-in slide-in-from-bottom-5 mx-auto w-full max-w-5xl duration-500 motion-reduce:animate-none">
              <div className="border border-zinc-950/10 bg-[#f7f2ea] p-6 md:p-8">
                <div className="flex flex-col items-center justify-center gap-4 border border-zinc-950/10 bg-white px-6 py-10 text-center md:py-14">
                  <Spinner className="size-6 text-zinc-950" />
                  <p className="text-sm leading-7 text-zinc-700 md:text-[15px]">
                    Your workspace is being generated.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {phase === "preview" && generated ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 grid gap-6 duration-500 motion-reduce:animate-none">
              <div className="flex flex-col gap-4 border border-zinc-950/10 bg-white/70 p-5 md:flex-row md:items-end md:justify-between md:p-6">
                <div className="max-w-3xl">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                    Generated workspace
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-zinc-950 md:text-5xl">
                    {generated.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-zinc-700 md:text-[15px]">
                    {generated.summary}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:self-start">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setPhase("compose")
                      setValidationMessage(null)
                      setErrorMessage(null)
                    }}
                    className="h-12 w-full rounded-none border-zinc-950/15 bg-[#f7f2ea] px-4 text-zinc-700 shadow-none hover:bg-white sm:w-auto"
                  >
                    Paste again
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    className="h-12 w-full rounded-none border border-zinc-950 bg-zinc-950 px-6 text-[#f6f1e8] hover:bg-zinc-800 sm:w-auto"
                  >
                    <Link href="/new">
                      Open workspace
                      <HugeiconsIcon icon={ArrowRight} className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <WorkspaceWidgetRenderer
                widgets={widgets}
                onChecklistItemToggle={handleChecklistItemToggle}
                selectedTableRows={selectedTableRows}
                onTableRowToggle={handleTableRowToggle}
              />
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
