"use client";

import { useEffect, useState } from "react";

import { ArrowRight } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { LandingNav } from "@/components/landing-nav";
import { Button } from "@/components/ui/button";
import { ModelMarquee } from "@/components/ui/marquee";
import PricingCards from "@/components/ui/pricing-cards";

const demoExamples = [
  {
    id: "coding",
    label: "Coding Plan",
    title: "Axerr MVP Coding Plan",
    plan: [
      "Day 1 — Setup: Next.js, Tailwind, shadcn/ui, tRPC, Node, Postgres, Drizzle ORM.",
      "Day 2 — Workspace system: create workspace, list workspaces, workspace view, users/workspaces/plans/widgets tables.",
      "Day 3 — Plan input: paste AI-generated plan and store it in the database.",
      "Day 4 — Plan parser: convert text into budget, task list, and timeline sections.",
      "Day 5 — Widget generator: create budget, task, and timeline widgets dynamically.",
      "Day 6 — Editing + persistence: edit widgets, add tasks, modify budgets, save changes.",
      "Day 7 — Sharing: generate a public link so users can share and publish plans.",
    ],
    widget: {
      title: "MVP Build Roadmap",
      subtitle: "",
      content: (
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["Day 1", "Project setup", "Done"],
            ["Day 2", "Workspace system", "In progress"],
            ["Day 3", "Plan input", "Ready"],
            ["Day 4", "Plan parser", "Queued"],
          ].map(([lane, task, state]) => (
            <button
              key={task}
              type="button"
              className="cursor-pointer border border-zinc-950/10 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-zinc-950 hover:shadow-[4px_4px_0_0_rgba(24,24,27,0.12)]"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                {lane}
              </p>
              <p className="mt-2 text-base font-medium text-zinc-950">{task}</p>
              <p className="mt-2 text-sm text-zinc-600">{state}</p>
            </button>
          ))}
        </div>
      ),
    },
  },
  {
    id: "budget",
    label: "Budget",
    title: "Axerr Budget Plan",
    plan: [
      "Initial budget: $1,200.",
      "Infrastructure: Vercel $20/month, Neon/Postgres $15/month, Storage $10/month.",
      "Domain + branding: Domain $12/year, logo tools $20, UI assets $50.",
      "AI processing: 500 requests/month, estimated $50–100/month.",
      "Marketing budget: $200. Miscellaneous tools/integrations/monitoring: $150.",
      "Estimated startup cost: ~$577 initial.",
    ],
    widget: {
      title: "Budget Breakdown",
      subtitle: "Startup budget structured automatically",
      content: (
        <div className="space-y-3 text-sm text-zinc-700">
          <div className="flex items-end justify-between border-b border-zinc-900/10 pb-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Estimated startup cost
              </p>
              <p className="mt-1 text-2xl font-semibold text-zinc-950">$577</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Initial budget
              </p>
              <p className="mt-1 text-lg font-medium text-emerald-700">
                $1,200
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              ["Infrastructure", "$45/mo"],
              ["Domain + branding", "$82"],
              ["AI processing", "$100"],
              ["Marketing", "$200"],
              ["Misc", "$150"],
            ].map(([label, value]) => (
              <button
                key={label}
                type="button"
                className="grid w-full cursor-pointer grid-cols-[1fr_auto] gap-3 border border-transparent px-2 py-1 text-left transition-colors hover:border-zinc-950/10 hover:bg-zinc-50"
              >
                <span>{label}</span>
                <span className="font-medium text-zinc-950">{value}</span>
              </button>
            ))}
          </div>
        </div>
      ),
    },
  },
  {
    id: "launch",
    label: "Launch Plan",
    title: "Axerr Startup Launch Plan",
    plan: [
      "Phase 1 — Idea validation: define the core problem, target indie hackers, startup founders, PMs, and students, then validate on Reddit, X, and Indie Hackers.",
      "Create a waitlist landing page with product description, email signup, and demo screenshots.",
      "Phase 2 — Product definition: Plan to structured workspace, interactive widgets, editable sections, shareable plans.",
      "Phase 3 — Build MVP: workspace creation, AI plan input, parser, widget generator, editing, and shareable page.",
      "Phase 4 — Distribution: launch on Product Hunt, Reddit, and Twitter/X.",
      "Phase 5 + 6 — Reach first 100 users and iterate weekly from feedback.",
    ],
    widget: {
      title: "Axerr Launch Workspace",
      subtitle: "Startup launch phases turned into a workspace",
      content: (
        <div className="space-y-3 text-sm text-zinc-700">
          {[
            ["Day 1", "Idea validation", true],
            ["Day 1", "Product definition", true],
            ["Week 1", "Build MVP", false],
            ["Launch", "Distribution", false],
          ].map(([day, task, done]) => (
            <button
              key={String(day)}
              type="button"
              className="grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-zinc-900/10 pb-3 text-left transition-colors hover:bg-white/60 last:border-b-0 last:pb-0"
            >
              <span className="border border-zinc-950 bg-[#f6f1e8] px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-zinc-600">
                {day}
              </span>
              <span
                className={
                  done ? "text-zinc-500 line-through" : "text-zinc-950"
                }
              >
                {task}
              </span>
              <span className={done ? "text-emerald-700" : "text-amber-700"}>
                {done ? "done" : "next"}
              </span>
            </button>
          ))}
        </div>
      ),
    },
  },
];

const features = [
  "Automatic plan structuring",
  "Interactive widgets",
  "Editable blocks",
  "Shareable workspaces",
  "Publish plans as pages",
];

export default function LandingPage() {
  const [showHeader, setShowHeader] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDemo, setActiveDemo] = useState(0);
  const [selectedCodingTask, setSelectedCodingTask] =
    useState("Workspace system");
  const [selectedBudgetCategory, setSelectedBudgetCategory] =
    useState("Infrastructure");
  const [selectedLaunchStep, setSelectedLaunchStep] = useState("Build MVP");

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
            <h1 className="max-w-5xl text-5xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-6xl md:text-7xl lg:text-8xl">
              Turn AI Plans into Interactive Workspaces
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-700 md:text-xl">
              PlanWiki converts AI-generated plans from ChatGPT, Claude, or
              Gemini, DeepSeek, and other AI models into interactive widgets you
              can visualize, edit, and share.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-none border border-zinc-950 bg-zinc-950 px-8 text-base text-[#f6f1e8] hover:bg-zinc-800"
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
                "Input",
                "Paste raw AI output from ChatGPT, Claude, Gemini, DeepSeek, or any other model.",
              ],
              [
                "Transform",
                "PlanWiki identifies steps, lists, dependencies, and data patterns.",
              ],
              [
                "Operate",
                "Your plan becomes a workspace you can actually use and share.",
              ],
            ].map(([title, copy]) => (
              <div
                key={title}
                className="border border-zinc-950/10 bg-white/70 p-5 backdrop-blur-sm"
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
          <div className="border border-zinc-950/10 bg-white/65 p-6 backdrop-blur-sm md:p-8">
            <div className="grid gap-6 md:grid-cols-[0.75fr_1.25fr] md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
                  Works with any model
                </p>
                <p className="mt-3 max-w-md text-lg leading-8 text-zinc-700">
                  Bring in plans from the tools you already use. PlanWiki is
                  built for messy AI output, not one specific model.
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
                See what your plans become
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700">
                Stop getting lost in long text plans. PlanWiki turns raw AI
                output into structured blocks you can inspect, edit, and use
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
              <article className="border border-zinc-950/10 bg-[#f7f2ea] p-5 md:p-8">
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
                  From this
                </p>
                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-zinc-950">
                  {currentDemo.title}
                </h3>
                <div className="mt-6 border border-zinc-950/10 bg-white p-5 font-mono text-sm leading-7 text-zinc-700">
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
                <div className="flex h-14 w-14 items-center justify-center border border-zinc-950 bg-zinc-950 text-white md:h-16 md:w-16">
                  <HugeiconsIcon
                    icon={ArrowRight}
                    className="h-7 w-7 md:h-8 md:w-8"
                  />
                </div>
              </div>

              <article
                className="overflow-hidden border border-zinc-950/10 bg-[#f7f2ea] p-5 text-zinc-950 md:p-8"
              >
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-600">
                  To this
                </p>
                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                  {currentDemo.widget.title}
                </h3>
                {currentDemo.widget.subtitle ? (
                  <p className="mt-3 text-base leading-7 text-zinc-700">
                    {currentDemo.widget.subtitle}
                  </p>
                ) : null}
                <div className="mt-6 border border-zinc-950/10 bg-white p-4 md:p-5">
                  {activeDemo === 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        ["Day 1", "Project setup", "Done"],
                        ["Day 2", "Workspace system", "In progress"],
                        ["Day 4", "Plan parser", "Blocked"],
                        ["Day 7", "Sharing", "Queued"],
                      ].map(([lane, task, state]) => {
                        const isSelected = selectedCodingTask === task;

                        return (
                          <button
                            key={task}
                            type="button"
                            onClick={() => setSelectedCodingTask(String(task))}
                            className={`cursor-pointer border p-4 text-left transition-all hover:-translate-y-0.5 ${
                              isSelected
                                ? "border-emerald-700 bg-emerald-50"
                                : "border-zinc-950/10 hover:border-zinc-950 hover:shadow-[4px_4px_0_0_rgba(24,24,27,0.12)]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                                  {lane}
                                </p>
                                <p className="mt-2 text-base font-medium text-zinc-950">
                                  {task}
                                </p>
                              </div>
                              <span
                                className={`mt-1 h-3 w-3 border ${
                                  isSelected
                                    ? "border-emerald-700 bg-emerald-700"
                                    : "border-zinc-950 bg-transparent"
                                }`}
                              />
                            </div>
                            <p className="mt-2 text-sm text-zinc-600">
                              {state}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  ) : activeDemo === 1 ? (
                    <div className="space-y-3 text-sm text-zinc-700">
                      <div className="flex items-end justify-between border-b border-zinc-900/10 pb-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                            Estimated startup cost
                          </p>
                          <p className="mt-1 text-2xl font-semibold text-zinc-950">
                            $577
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                            Focus
                          </p>
                          <p className="mt-1 text-lg font-medium text-zinc-950">
                            {selectedBudgetCategory}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {[
                          ["Infrastructure", "$45/mo"],
                          ["Domain + branding", "$82"],
                          ["AI processing", "$100"],
                          ["Marketing", "$200"],
                          ["Misc", "$150"],
                        ].map(([label, value]) => {
                          const isSelected = selectedBudgetCategory === label;

                          return (
                            <button
                              key={label}
                              type="button"
                              onClick={() =>
                                setSelectedBudgetCategory(String(label))
                              }
                              className={`grid w-full cursor-pointer grid-cols-[1fr_auto] gap-3 border px-2 py-2 text-left transition-colors ${
                                isSelected
                                  ? "border-emerald-700 bg-emerald-700 text-white"
                                  : "border-transparent bg-white hover:border-zinc-950/10 hover:bg-zinc-50"
                              }`}
                            >
                              <span>{label}</span>
                              <span
                                className={
                                  isSelected
                                    ? "font-medium text-white"
                                    : "font-medium text-zinc-950"
                                }
                              >
                                {value}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-sm text-zinc-700">
                      {[
                        ["Day 1", "Idea validation", true],
                        ["Day 1", "Product definition", true],
                        ["Week 1", "Build MVP", false],
                        ["Launch", "Distribution", false],
                      ].map(([day, task, done]) => {
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
                              className={`border px-2 py-1 text-[10px] uppercase tracking-[0.24em] ${
                                isSelected
                                  ? "border-emerald-700 bg-emerald-700 text-white"
                                  : "border-zinc-950 bg-[#f6f1e8] text-zinc-600"
                              }`}
                            >
                              {day}
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
                              className={done ? "text-emerald-700" : "text-zinc-600"}
                            >
                              {isSelected ? "open" : done ? "done" : "next"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </article>
            </div>

            <div className="mt-8 flex flex-col gap-4 border border-zinc-950/10 bg-[#f7f2ea] p-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
                  Demo workspace
                </p>
                <p className="mt-3 max-w-sm text-lg leading-7 text-zinc-700">
                  See a plan turn into a workspace you can actually use.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="h-12 border border-zinc-950 bg-zinc-950 px-6 text-white hover:bg-zinc-800 rounded-none"
              >
                <Link href="/login">
                  Explore Demo Workspace
                  <HugeiconsIcon
                    icon={ArrowRight}
                    className="ml-2 h-5 w-5 transition-transform group-hover/button:translate-x-1"
                  />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-zinc-950 md:text-5xl">
                Structured enough to visualize, edit and share
              </h2>
            </div>
            <div className="grid gap-px border border-zinc-950 bg-zinc-950 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature}
                  className={`bg-white p-5 text-lg text-zinc-900 ${
                    feature === "Publish plans as pages" ? "sm:col-span-2" : ""
                  }`}
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <div className="grid gap-10 md:grid-cols-[0.75fr_1.25fr]">
            <div>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-zinc-950 md:text-5xl">
                Choose the right plan for you
              </h2>
              <p className="mt-5 max-w-md text-lg leading-8 text-zinc-700">
                Every pasted input becomes a workspace. Pro adds higher
                workspace limits, version history, and export tools for heavier
                use.
              </p>
            </div>
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
                  Built for AI Heavy Users
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-700">
                  For people already using ChatGPT, Claude, or Gemini to think
                  through work and who need those plans to become usable.
                </p>
              </div>
              <div className="grid gap-px border border-zinc-950 bg-zinc-950">
                {[
                  "Startup execution plans",
                  "Budget planning",
                  "Project planning",
                  "Study schedules",
                  "Personal goal tracking",
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
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                "People who already use AI to map out work before they execute",
                "Teams collecting long AI plans that need structure before execution",
                "Operators who want plans they can review, edit, and share without rewriting everything",
              ].map((item) => (
                <div
                  key={item}
                  className="border border-zinc-950/10 bg-white p-5 text-base leading-7 text-zinc-900"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="open-source"
          className="mx-auto max-w-7xl px-4 py-20 md:px-6"
        >
          <div className="grid gap-10 border border-zinc-950 bg-zinc-950 p-8 text-[#f6f1e8] md:grid-cols-[1fr_auto] md:p-10">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
                Open Source
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
                PlanWiki is open source.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
                Inspect the code, contribute, and self host if needed. The
                product stays transparent and adaptable.
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
                className="h-12 rounded-none border border-[#f6f1e8] bg-[#f6f1e8] px-6 text-zinc-950 hover:bg-zinc-200"
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
                className="h-12 rounded-none border-[#f6f1e8] bg-transparent px-6 text-[#f6f1e8] hover:bg-white hover:text-zinc-950"
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
              className="hover:text-zinc-950 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-zinc-950 transition-colors"
            >
              Terms
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
