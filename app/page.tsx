"use client";

import { useEffect, useState } from "react";

import { ArrowRight } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { LandingNav } from "@/components/landing-nav";
import { Button } from "@/components/ui/button";
import { ModelMarquee } from "@/components/ui/marquee";
import PricingCards from "@/components/ui/pricing-cards";
import { authClient } from "@/lib/auth/client";

const demoExamples = [
  {
    id: "delivery",
    label: "Food Delivery",
    title: "Food Delivery App Launch Plan",
    plan: [
      "Week 1 — Onboard 10 restaurants, define rider zones, and finalize the customer ordering flow.",
      "Week 2 — Ship restaurant dashboard basics, rider assignment flow, and live order tracking.",
      "Week 3 — Run a pilot in one neighborhood, collect rider and restaurant feedback, and fix delivery bottlenecks.",
      "Core features — Menu management, rider assignment, live map tracking, customer order status, and restaurant payouts.",
      "Success metrics — First 100 orders, average delivery time under 35 minutes, repeat order rate above 20%.",
    ],
    widget: {
      title: "Delivery Launch Workspace",
      subtitle: "Launch tasks, owners, and live execution status in one place.",
    },
  },
  {
    id: "restaurant",
    label: "Restaurant SaaS",
    title: "Restaurant Operations SaaS PRD",
    plan: [
      "Goal — Build a lightweight operations tool for small restaurants to manage inventory, staff shifts, and daily sales in one place.",
      "Requirement 1 — Restaurant owners can track stock levels and low-inventory alerts.",
      "Requirement 2 — Managers can assign and edit staff shifts from mobile.",
      "Requirement 3 — Daily sales summaries should be visible by location and time period.",
      "Requirement 4 — The system should support owner, manager, and staff roles.",
      "Success metrics — Weekly active locations, shift completion rate, and reduction in stockout incidents.",
    ],
    widget: {
      title: "Restaurant Ops Workspace",
      subtitle:
        "Requirements converted into scoped sections the team can review.",
    },
  },
  {
    id: "booking",
    label: "Booking App",
    title: "Service Booking Marketplace Plan",
    plan: [
      "Phase 1 — Recruit the first 50 service providers, define service categories, and set booking rules.",
      "Phase 2 — Build provider profiles, booking slots, and customer payments.",
      "Phase 3 — Launch in one city, monitor cancellations, and improve provider response times.",
      "Core features — Provider profiles, availability calendar, customer checkout, reviews, booking confirmation, and support chat.",
      "Target metrics — 200 completed bookings in month one, provider acceptance rate above 75%, customer rating above 4.5.",
    ],
    widget: {
      title: "Marketplace Launch Workspace",
      subtitle:
        "A launch plan turned into phases with status and next actions.",
    },
  },
];

const features = [
  "Roadmaps broken into phases and milestones your team can track",
  "PRDs turned into structured execution views agents can read and act on",
  "Connect your agents via MCP no manual task setup required",
  "Shared workspaces where your team and agents work from the same source of truth",
  "Open source and self-hostable run it yourself in minutes",
];

export default function LandingPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [showHeader, setShowHeader] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDemo, setActiveDemo] = useState(0);
  const [selectedSprintTask, setSelectedSprintTask] =
    useState("Rider assignment flow");
  const [selectedPrdSection, setSelectedPrdSection] =
    useState("Staff scheduling");
  const [selectedLaunchStep, setSelectedLaunchStep] =
    useState("City launch");

  useEffect(() => {
    if (!isSessionPending && session?.user) {
      router.replace("/workspaces");
    }
  }, [isSessionPending, router, session]);

  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 40);
      setShowHeader(currentScrollY < lastScrollY || currentScrollY < 40);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentDemo = demoExamples[activeDemo];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f6f1e8] text-zinc-950 selection:bg-zinc-950 selection:text-[#f6f1e8]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(22,163,74,0.12),transparent_24%),radial-gradient(circle_at_85%_18%,rgba(245,158,11,0.14),transparent_20%),linear-gradient(to_right,rgba(24,24,27,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.05)_1px,transparent_1px)] bg-[size:auto,auto,28px_28px,28px_28px]" />

      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "border-b border-zinc-950/10 bg-[#f6f1e8]/85 backdrop-blur-md"
            : "bg-transparent"
        } ${showHeader ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"}`}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-6 md:py-4">
          <LandingNav showLogo />
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pb-10 pt-28 md:px-6 md:pb-12 md:pt-36">
          <div className="max-w-4xl">
            <h1 className="max-w-5xl text-4xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-5xl md:text-6xl lg:text-7xl">
              AI-Native Workspace for Agents and Product Teams
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-700 md:text-xl">
              PlanWiki is an open source platform for product teams and AI
              agents. Paste long AI-generated plans, roadmaps, or ideas to turn
              them into interactive widgets your team and agents can execute.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-sm border border-zinc-950 bg-zinc-950 px-8 text-base text-[#f6f1e8] hover:bg-zinc-800"
            >
              <Link href="/login">
                Get Started for Free
                <HugeiconsIcon
                  icon={ArrowRight}
                  className="ml-2 h-5 w-5 transition-transform group-hover/button:translate-x-1"
                />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              [
                "Paste",
                "Drop a feature spec, sprint plan, or project brief from any AI. Claude, ChatGPT, Gemini or any other AI Generated Output.",
              ],
              [
                "Structure",
                "PlanWiki breaks it into tasks, phases, and execution views your team can review and agents can act on immediately.",
              ],
              [
                "Execute",
                "Assign tasks to your AI Agents via MCP. Track progress in real time. No time to manually create boards, tickets, or project setups — just start working.",
              ],
            ].map(([title, copy]) => (
              <div
                key={title}
                className="rounded-sm border border-zinc-950/10 bg-white/70 p-5 backdrop-blur-sm"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                  {title}
                </p>
                <p className="mt-3 text-base leading-7 text-zinc-800">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-6 md:px-6 md:pb-8">
          <div className="rounded-sm border border-zinc-950/10 bg-white/65 p-6 backdrop-blur-sm md:p-8">
            <div className="grid gap-6 md:grid-cols-[0.75fr_1.25fr] md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
                  Connect your agents
                </p>
                <p className="mt-3 max-w-md text-lg leading-8 text-zinc-700">
                  Paste a plan from any AI, connect your agents via MCP, and
                  move faster from planning to execution all in one workspace.
                </p>
              </div>
              <ModelMarquee />
            </div>
          </div>
        </section>
        <section id="demo" className="text-zinc-950">
          <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
            <div className="max-w-3xl">
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
                Paste the plan. Run the workspace.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700">
                Sprints, PRDs, and launch plans become structured workspaces
                your team and agents can review, assign, and execute
                immediately.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {demoExamples.map((demo, index) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => setActiveDemo(index)}
                  className={`border px-4 py-2 text-sm uppercase tracking-[0.24em] transition-colors ${
                    activeDemo === index
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-950/15 bg-[#f6f1e8] text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {demo.label}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-[1fr_auto_1fr] xl:items-center">
              <article className="rounded-sm border border-zinc-950/10 bg-[#f7f2ea] p-5 md:p-8">
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
                  From this
                </p>
                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-zinc-950">
                  {currentDemo.title}
                </h3>
                <div className="mt-6 rounded-sm border border-zinc-950/10 bg-white p-5 font-mono text-sm leading-7 text-zinc-700">
                  <p className="mb-4 text-xs uppercase tracking-[0.24em] text-zinc-500">
                    raw ai output
                  </p>
                  {currentDemo.plan.map((line, index) => (
                    <p
                      key={line}
                      className="transition-colors hover:text-zinc-950"
                    >
                      {index + 1}. {line}
                    </p>
                  ))}
                </div>
              </article>

              <div className="flex items-center justify-center py-1 xl:py-0">
                <div className="flex h-14 w-14 items-center justify-center rounded-sm border border-zinc-950 bg-zinc-950 text-white md:h-16 md:w-16">
                  <HugeiconsIcon
                    icon={ArrowRight}
                    className="h-7 w-7 md:h-8 md:w-8"
                  />
                </div>
              </div>

              <article className="overflow-hidden rounded-sm border border-zinc-950/10 bg-[#f7f2ea] p-5 text-zinc-950 md:p-8">
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-600">
                  To this
                </p>
                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                  {currentDemo.widget.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-700">
                  {currentDemo.widget.subtitle}
                </p>
                <div className="mt-6 rounded-sm border border-zinc-950/10 bg-white p-4 md:p-5">
                  {activeDemo === 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        [
                          "Task 1",
                          "Restaurant onboarding",
                          "done",
                          "Ops lead",
                        ],
                        [
                          "Task 2",
                          "Rider assignment flow",
                          "running",
                          "Product",
                        ],
                        [
                          "Task 3",
                          "Live order tracking",
                          "running",
                          "Engineering",
                        ],
                        ["Task 4", "Pilot checklist", "queued", "Unassigned"],
                      ].map(([tag, task, state, agent]) => {
                        const isSelected = selectedSprintTask === task;
                        const stateColor =
                          state === "done"
                            ? "text-emerald-700"
                            : state === "running"
                              ? "text-amber-700"
                              : "text-zinc-400";

                        return (
                          <button
                            key={task}
                            type="button"
                            onClick={() => setSelectedSprintTask(String(task))}
                            className={`cursor-pointer rounded-sm border p-4 text-left transition-all hover:-translate-y-0.5 ${
                              isSelected
                                ? "border-emerald-700 bg-emerald-50"
                                : "border-zinc-950/10 hover:border-zinc-950 hover:shadow-[4px_4px_0_0_rgba(24,24,27,0.12)]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                                {tag}
                              </p>
                              <span
                                className={`text-[10px] uppercase tracking-[0.2em] ${stateColor}`}
                              >
                                {state}
                              </span>
                            </div>
                            <p className="mt-2 text-sm font-medium text-zinc-950">
                              {task}
                            </p>
                            <div className="mt-3 flex items-center gap-1.5">
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  agent === "Unassigned"
                                    ? "bg-zinc-300"
                                    : "bg-emerald-500"
                                }`}
                              />
                              <span className="text-xs text-zinc-500">
                                {agent}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  {activeDemo === 1 ? (
                    <div className="space-y-3 text-sm text-zinc-700">
                      <div className="flex items-end justify-between border-b border-zinc-900/10 pb-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                            Spec
                          </p>
                          <p className="mt-1 text-xl font-semibold text-zinc-950">
                            Restaurant Ops
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                            Viewing
                          </p>
                          <p className="mt-1 max-w-[130px] truncate text-sm font-medium text-zinc-950">
                            {selectedPrdSection}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {[
                          ["R1", "Inventory tracking", "Low-stock alerts"],
                          ["R2", "Staff scheduling", "Mobile shift editing"],
                          ["R3", "Sales summaries", "By location and time"],
                          ["R4", "Role access", "Owner / manager / staff"],
                          ["-", "Later", "Supplier reminders"],
                        ].map(([tag, label, detail]) => {
                          const isSelected = selectedPrdSection === label;
                          const isOutOfScope = tag === "-";

                          return (
                            <button
                              key={label}
                              type="button"
                              onClick={() =>
                                setSelectedPrdSection(String(label))
                              }
                              className={`grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 rounded-sm border px-3 py-2 text-left transition-colors ${
                                isSelected
                                  ? "border-emerald-700 bg-emerald-700 text-white"
                                  : "border-transparent bg-white hover:border-zinc-950/10 hover:bg-zinc-50"
                              }`}
                            >
                              <span
                                className={`text-[10px] uppercase tracking-[0.2em] ${
                                  isSelected
                                    ? "text-emerald-100"
                                    : isOutOfScope
                                      ? "text-zinc-300"
                                      : "text-zinc-400"
                                }`}
                              >
                                {tag}
                              </span>
                              <span
                                className={`text-sm ${
                                  isSelected
                                    ? "font-medium text-white"
                                    : isOutOfScope
                                      ? "text-zinc-400 line-through"
                                      : "text-zinc-800"
                                }`}
                              >
                                {label}
                              </span>
                              <span
                                className={`text-xs ${
                                  isSelected
                                    ? "text-emerald-100"
                                    : "text-zinc-400"
                                }`}
                              >
                                {detail}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {activeDemo === 2 ? (
                    <div className="space-y-3 text-sm text-zinc-700">
                      {[
                        ["Prep", "Provider recruitment", true],
                        ["Build", "Booking and payments", true],
                        ["Launch", "City launch", false],
                        ["Ops", "Cancellation review", false],
                        ["Growth", "Provider response time", false],
                      ].map(([phase, task, done]) => {
                        const isSelected = selectedLaunchStep === task;

                        return (
                          <button
                            key={String(task)}
                            type="button"
                            onClick={() => setSelectedLaunchStep(String(task))}
                            className={`grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-zinc-900/10 pb-3 text-left transition-colors hover:bg-white/60 last:border-b-0 last:pb-0 ${
                              isSelected ? "bg-emerald-50/70" : ""
                            }`}
                          >
                            <span
                              className={`rounded-sm border px-2 py-1 text-[10px] uppercase tracking-[0.24em] ${
                                isSelected
                                  ? "border-emerald-700 bg-emerald-700 text-white"
                                  : "border-zinc-950 bg-[#f6f1e8] text-zinc-600"
                              }`}
                            >
                              {phase}
                            </span>
                            <span
                              className={
                                done
                                  ? "text-zinc-500 line-through"
                                  : "text-zinc-950"
                              }
                            >
                              {task}
                            </span>
                            <span
                              className={
                                done ? "text-emerald-700" : "text-zinc-600"
                              }
                            >
                              {isSelected ? "open" : done ? "done" : "next"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </article>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16"
        >
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Features
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              Built for the moment after the plan lands
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {features.map((feature) => (
              <div
                key={feature}
                className="rounded-sm border border-zinc-950/10 bg-white/70 p-5 text-base text-zinc-800 backdrop-blur-sm"
              >
                {feature}
              </div>
            ))}
          </div>
        </section>

        <section
          id="pricing"
          className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20"
        >
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Pricing
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-zinc-950 md:text-5xl">
              Choose the right plan for your team
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700 md:text-lg md:leading-8">
              Start free, add more agents when the work gets real, and move to
              team access when execution stops being a solo workflow.
            </p>
          </div>
          <div className="mt-10">
            <PricingCards />
          </div>
        </section>

        <section
          id="use-cases"
          className="border-y border-zinc-950/10 bg-white/60"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
            <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
              <div>
                <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-zinc-950 md:text-5xl">
                  Built for teams that move from planning to execution fast
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-700">
                  Your AI already generates the plan. PlanWiki makes sure it
                  does not die in a chat window it becomes a workspace your team
                  and agents can execute from the moment it lands.
                </p>
              </div>
              <div className="grid gap-px rounded-sm border border-zinc-950 bg-zinc-950">
                {[
                  "Product roadmaps turned into trackable phases and milestones",
                  "PRDs and specs structured into execution views agents can read and act on",
                  "Launch coordination broken into assignable tasks with clear ownership",
                  "Backlog shaping that goes straight from AI output to prioritised widget",
                  "Cross-functional plans your whole team works from without rebuilding anything",
                ].map((item) => (
                  <div
                    key={item}
                    className="bg-[#f6f1e8] p-5 text-base leading-7 text-zinc-900"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="open-source"
          className="mx-auto max-w-7xl px-4 py-20 md:px-6"
        >
          <div className="grid gap-10 rounded-sm border border-zinc-950 bg-zinc-950 p-8 text-[#f6f1e8] md:grid-cols-[1fr_auto] md:p-10">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
                Open Source
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
                PlanWiki is open source.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
                Inspect the code, contribute improvements, and self-host if your
                team needs full control over how workspaces and agents are set
                up.
              </p>
              <div className="mt-8 grid gap-3 text-sm uppercase tracking-[0.24em] text-zinc-400 sm:grid-cols-3">
                <span>Inspect the code</span>
                <span>Contribute</span>
                <span>Self host if needed</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 md:w-56">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-sm border border-[#f6f1e8] bg-[#f6f1e8] px-6 text-zinc-950 hover:bg-zinc-200"
              >
                <Link
                  href="https://github.com/planwiki/planwiki-app"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-sm border-[#f6f1e8] bg-transparent px-6 text-[#f6f1e8] hover:bg-white hover:text-zinc-950"
              >
                <Link
                  href="https://github.com/planwiki/planwiki-app#readme"
                  target="_blank"
                  rel="noreferrer"
                >
                  Docs
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <footer className="mx-auto flex max-w-7xl items-center justify-between px-4 pb-10 pt-2 text-sm text-zinc-600 md:px-6">
          <p>© {new Date().getFullYear()} PlanWiki</p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-zinc-950"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-zinc-950"
            >
              Terms
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
