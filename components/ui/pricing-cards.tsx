import Link from "next/link";

import { Button } from "@/components/ui/button";

const hobbyFeatures = [
  ["Workspaces", "2 cloud, unlimited self-host"],
  ["MCP agents", "1 cloud, unlimited self-host"],
  ["History", "7 days cloud, unlimited self-host"],
  ["Sharing", "Public and private workspaces"],
  ["Seats", "1 cloud, unlimited self-host"],
  ["Support", "Community or GitHub"],
];

const paidPlans = [
  {
    name: "Pro",
    price: "$10",
    suffix: "/month",
    description: "For solo builders running active projects with multiple agents.",
    features: [
      ["Workspaces", "10"],
      ["MCP agents", "3"],
      ["History", "30 days"],
      ["Snapshots", "Before every agent run"],
      ["Audit log", "Full agent action history"],
      ["Seats", "1"],
      ["Support", "Email"],
    ],
    trigger:
      "Upgrade when Hobby limits start blocking real work.",
    ctaLabel: "Start Pro",
    featured: true,
  },
  {
    name: "Team",
    price: "$25",
    suffix: "/month",
    description: "For small teams coordinating shared execution across people and agents.",
    features: [
      ["Workspaces", "Unlimited"],
      ["MCP agents", "Unlimited"],
      ["History", "90 days"],
      ["Snapshots", "Before every agent run"],
      ["Audit log", "Full agent action history"],
      ["Dashboard", "Per-workspace usage view"],
      ["Seats", "Up to 5"],
      ["Access", "Viewer, Editor, Agent-assignor"],
      ["Support", "Priority"],
    ],
    trigger:
      "Upgrade when a second person needs access.",
    ctaLabel: "Choose Team",
    featured: false,
  },
];

function FeatureRow({
  label,
  value,
  featured,
}: {
  label: string;
  value: string;
  featured: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-t px-0 py-2.5 text-sm ${
        featured ? "border-white/10" : "border-zinc-950/10"
      }`}
    >
      <span className={featured ? "text-zinc-300" : "text-zinc-600"}>
        {label}
      </span>
      <span className={featured ? "text-white" : "text-zinc-950"}>{value}</span>
    </div>
  );
}

export default function PricingCards() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <article className="rounded-sm border border-zinc-950/10 bg-white p-4 text-zinc-950 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Hobby
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Free
            </h3>
          </div>
          <span className="rounded-sm border border-zinc-950/10 bg-[#f7f2ea] px-2.5 py-1.5 text-[10px] uppercase tracking-[0.24em] text-zinc-600">
            Cloud / Self-Host
          </span>
        </div>

        <p className="mt-3 max-w-md text-sm leading-6 text-zinc-700">
          Start free in the cloud or self-host on your own stack.
        </p>

        <div className="mt-5">
          {hobbyFeatures.map(([label, value]) => (
            <FeatureRow
              key={label}
              label={label}
              value={value}
              featured={false}
            />
          ))}
        </div>

        <p className="mt-4 text-sm leading-6 text-zinc-600">
          Upgrade when you outgrow 2 workspaces or need more agent capacity.
        </p>

        <Button
          asChild
          size="lg"
          className="mt-5 h-10 w-full rounded-sm border border-zinc-950 bg-zinc-950 px-4 text-sm text-white hover:bg-zinc-800"
        >
          <Link href="/login">Start Free</Link>
        </Button>
      </article>

      {paidPlans.map((plan) => (
        <article
          key={plan.name}
          className={`rounded-sm border p-4 sm:p-5 ${
            plan.featured
              ? "border-zinc-950 bg-zinc-950 text-[#f6f1e8]"
              : "border-zinc-950/10 bg-white text-zinc-950"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className={`text-xs uppercase tracking-[0.32em] ${
                  plan.featured ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                {plan.name}
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                {plan.price}
                <span
                  className={`ml-1 text-base font-normal ${
                    plan.featured ? "text-zinc-300" : "text-zinc-500"
                  }`}
                >
                  {plan.suffix}
                </span>
              </h3>
            </div>
            {plan.featured ? (
              <span className="rounded-sm border border-white/20 bg-white/10 px-2.5 py-1 text-xs uppercase tracking-[0.24em] text-white">
                Most Popular
              </span>
            ) : null}
          </div>

          <p
            className={`mt-3 text-sm leading-6 ${
              plan.featured ? "text-zinc-300" : "text-zinc-700"
            }`}
          >
            {plan.description}
          </p>

          <div className="mt-5">
            {plan.features.map(([label, value]) => (
              <FeatureRow
                key={label}
                label={label}
                value={value}
                featured={plan.featured}
              />
            ))}
          </div>

          <p
            className={`mt-4 text-sm leading-6 ${
              plan.featured ? "text-zinc-300" : "text-zinc-600"
            }`}
          >
            {plan.trigger}
          </p>

          <Button
            asChild
            size="lg"
            className={`mt-5 h-10 w-full rounded-sm border px-4 text-sm ${
              plan.featured
                ? "border-white bg-white text-zinc-950 hover:bg-zinc-200"
                : "border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800"
            }`}
          >
            <Link href="/login">{plan.ctaLabel}</Link>
          </Button>
        </article>
      ))}
    </div>
  );
}
