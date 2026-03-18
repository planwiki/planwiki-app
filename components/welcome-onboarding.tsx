"use client"

import {
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react"
import { useRouter } from "next/navigation"

import { ArrowRight, SentIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  SimpleAgentConnect,
  type ApiKeyRecord,
} from "@/components/agents/simple-agent-connect"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { trpc } from "@/lib/trpc"

const samplePlans = [
  {
    id: "food-delivery",
    label: "Food Delivery App",
    text: `Food Delivery App Launch Plan

Goal: launch a local food delivery app that helps restaurants accept orders and lets bikers deliver them faster.

Week 1: onboard 10 restaurants, define rider zones, and finalize the customer ordering flow.
Week 2: ship restaurant dashboard basics, rider assignment flow, and live order tracking.
Week 3: run a pilot in one neighborhood, collect rider and restaurant feedback, and fix delivery bottlenecks.

Core features: menu management, rider assignment, live map tracking, customer order status, restaurant payouts.
Operational needs: rider onboarding, restaurant support, failed delivery handling, and refund workflows.

Success metrics: first 100 orders, average delivery time under 35 minutes, repeat order rate above 20%.
Teams: product, operations, restaurant success, rider ops.

1. Onboard restaurant partners
2. Set biker delivery zones
3. Build live order tracking
4. Test payout flow for riders
5. Prepare pilot launch checklist`,
  },
  {
    id: "restaurant-saas",
    label: "Restaurant SaaS",
    text: `Restaurant Operations SaaS PRD

Goal: build a lightweight operations tool for small restaurants to manage inventory, staff shifts, and daily sales in one place.

Requirement 1: restaurant owners can track stock levels and low-inventory alerts.
Requirement 2: managers can assign and edit staff shifts from mobile.
Requirement 3: daily sales summaries should be visible by location and time period.
Requirement 4: the system should support owner, manager, and staff roles.

Core features: inventory dashboard, purchase log, shift calendar, daily sales widgets, and role-based access.
Nice to have later: supplier reminders, multi-location comparison, and printable closing reports.

Risks: inconsistent stock updates, weak mobile usability, slow setup for first-time restaurants.
Success metrics: weekly active locations, shift completion rate, reduction in stockout incidents.

1. Design inventory tracking flow
2. Build staff scheduling dashboard
3. Add daily sales summary widgets
4. Set up role permissions
5. Run pilot with 3 restaurants`,
  },
  {
    id: "booking-marketplace",
    label: "Booking Marketplace",
    text: `Service Booking Marketplace Plan

Goal: launch a marketplace where customers can book home cleaning, plumbing, and electrical services from vetted local providers.

Phase 1: recruit the first 50 service providers, define service categories, and set booking rules.
Phase 2: build provider profiles, booking slots, and customer payments.
Phase 3: launch in one city, monitor cancellations, and improve provider response times.

Core features: provider profiles, availability calendar, customer checkout, reviews, booking confirmation, and support chat.
Operations scope: provider verification, cancellation policy, dispute handling, and city-by-city rollout tracking.

Target metrics: 200 completed bookings in month one, provider acceptance rate above 75%, customer rating above 4.5.
Teams: product, growth, provider operations, support.

1. Recruit local providers
2. Launch provider profiles
3. Add booking calendar and payments
4. Set up review system
5. Track cancellations and support issues`,
  },
] as const

const MIN_PLAN_LENGTH = 50

type WelcomeOnboardingProps = {
  userName?: string | null
  userEmail?: string | null
  mcpUrl: string
  initialKeys: ApiKeyRecord[]
}

type GeneratedWorkspaceState = {
  title: string
  summary: string
  workspaceId?: string
  slug?: string
}

export function WelcomeOnboarding({
  userName,
  userEmail,
  mcpUrl,
  initialKeys,
}: WelcomeOnboardingProps) {
  const router = useRouter()
  const [input, setInput] = useState("")
  const [selectedSampleId, setSelectedSampleId] = useState<
    (typeof samplePlans)[number]["id"] | null
  >(null)
  const [phase, setPhase] = useState<
    "compose" | "loading" | "ready" | "connect" | "error"
  >("compose")
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [generated, setGenerated] = useState<GeneratedWorkspaceState | null>(
    null,
  )

  const generateWorkspace = trpc.workspaces.generateNewWorkspace.useMutation()

  const rawUserName =
    (
      userName ||
      userEmail?.split("@")[0] ||
      "there"
    )?.trim() || "there"
  const firstName = rawUserName.split(" ")[0] || "there"
  const headerTitle =
    phase === "connect" ? "Connect your AI agent" : "Start with a plan"
  const headerCopy =
    phase === "connect"
      ? "Connect Cursor, Codex, or Claude Code before you enter the workspace."
      : `${firstName}, pick a plan sample or paste your own to generate a workspace.`

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
        title: result.data.title,
        summary: result.data.summary,
        workspaceId: result.data.workspaceId,
        slug: result.data.slug,
      }

      setGenerated(nextGenerated)
      setPhase("ready")
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

  const openWorkspace = () => {
    if (!generated?.slug) return
    router.push(`/workspaces/${generated.slug}`)
    router.refresh()
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#f6f1e8]">
      <section className="flex flex-1 justify-center px-4 py-8 sm:py-10 md:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="animate-in fade-in slide-in-from-bottom-4 text-center duration-500 motion-reduce:animate-none">
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-5xl md:text-6xl">
              {headerTitle}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-700 md:text-[15px]">
              {headerCopy}
            </p>
          </div>

          {phase === "compose" || phase === "error" ? (
            <div className="animate-in fade-in slide-in-from-bottom-5 mx-auto w-full max-w-5xl duration-500 motion-reduce:animate-none">
              <div className="rounded-sm border border-zinc-950/10 bg-[#f7f2ea] p-4 md:p-5">
                <div
                  className={`rounded-sm border border-zinc-950/10 p-3 md:p-4 ${
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
                          className={`shrink-0 rounded-sm border px-3 py-2 text-xs uppercase tracking-[0.22em] transition-[transform,colors] duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
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
                    placeholder="Pick a sample product plan to load its AI-generated text."
                    className="mt-3 min-h-52 resize-none rounded-none border-none bg-transparent px-0 py-0 text-base leading-7 text-zinc-800 shadow-none focus-visible:border-none focus-visible:ring-0 md:text-[15px]"
                    aria-label="Onboarding plan input"
                  />

                  {validationMessage ? (
                    <p className="mt-3 text-sm leading-6 text-[#8d3b28]">
                      {validationMessage}
                    </p>
                  ) : null}

                  {phase === "error" && errorMessage ? (
                    <div className="mt-4 rounded-sm border border-[#d8b3a8] bg-[#fffdfb] px-4 py-4">
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
                          }}
                          className="h-10 rounded-sm border-zinc-950/15 bg-white px-4 text-zinc-700 shadow-none hover:bg-[#f7f2ea]"
                        >
                          Try again
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-3 flex flex-col gap-3 border-t border-zinc-950/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-md text-xs leading-6 text-zinc-500">
                      Pick a sample plan and generate the workspace.
                    </p>
                    <Button
                      type="button"
                      onClick={() => void handleGenerate()}
                      disabled={!canGenerate}
                      className="h-11 w-full rounded-sm border-zinc-950 bg-zinc-950 px-4 text-[#f6f1e8] hover:bg-zinc-800 sm:w-auto"
                    >
                      {generateWorkspace.isPending
                        ? "Generating..."
                        : "Generate Workspace"}
                      <HugeiconsIcon
                        icon={SentIcon}
                        className={`size-4 ${generateWorkspace.isPending ? "animate-pulse" : ""}`}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {phase === "loading" ? (
            <div className="animate-in fade-in slide-in-from-bottom-5 mx-auto w-full max-w-5xl duration-500 motion-reduce:animate-none">
              <div className="rounded-sm border border-zinc-950/10 bg-[#f7f2ea] p-6 md:p-8">
                <div className="flex flex-col items-center justify-center gap-4 rounded-sm border border-zinc-950/10 bg-white px-6 py-10 text-center md:py-14">
                  <Spinner className="size-6 text-zinc-950" />
                  <p className="text-sm leading-7 text-zinc-700 md:text-[15px]">
                    Your workspace is being generated.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {phase === "ready" && generated ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 grid gap-6 duration-500 motion-reduce:animate-none">
              <div className="mx-auto w-full max-w-4xl rounded-sm border border-zinc-950/10 bg-white/70 p-5 md:p-6">
                <div className="max-w-3xl">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                    Workspace ready
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-zinc-950 md:text-5xl">
                    {generated.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-zinc-700 md:text-[15px]">
                    {generated.summary}
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setPhase("compose")
                      setValidationMessage(null)
                      setErrorMessage(null)
                    }}
                    className="h-12 w-full rounded-sm border-zinc-950/15 bg-[#f7f2ea] px-4 text-zinc-700 shadow-none hover:bg-white sm:w-auto"
                  >
                    Paste again
                  </Button>

                  <Button
                    size="lg"
                    onClick={() => setPhase("connect")}
                    className="h-12 w-full rounded-sm border border-zinc-950 bg-zinc-950 px-6 text-[#f6f1e8] hover:bg-zinc-800 sm:w-auto"
                  >
                    Next
                    <HugeiconsIcon icon={ArrowRight} className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {phase === "connect" && generated ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto grid w-full max-w-5xl gap-4 duration-500 motion-reduce:animate-none">
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={openWorkspace}
                  className="h-10 rounded-sm border border-zinc-950 bg-zinc-950 px-4 text-sm text-[#f6f1e8] hover:bg-zinc-800"
                >
                  Skip
                </Button>
              </div>

              <SimpleAgentConnect mcpUrl={mcpUrl} initialKeys={initialKeys} />
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
