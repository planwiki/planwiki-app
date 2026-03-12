import Link from "next/link";

import { Button } from "@/components/ui/button";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    suffix: "/month",
    description: "For trying PlanWiki with lighter planning volume.",
    features: [
      "10 workspaces / month",
      "50 widgets",
      "Basic widgets",
      "Private workspaces",
      "Public share links",
      "Publish pages",
    ],
    ctaLabel: "Get Started",
    ctaHref: "/login",
    featured: false,
  },
  {
    name: "Pro",
    price: "$8",
    suffix: "/month",
    description: "For people managing active AI-driven workflows every week.",
    features: [
      "Unlimited workspaces",
      "All widgets",
      "Private workspaces",
      "Export plans",
      "Version history",
      "Share workspaces",
      "Workspaces private unless shared",
    ],
    ctaLabel: "Get Started",
    ctaHref: "/login",
    featured: true,
  },
];

function CheckIcon({ featured }: { featured: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <path
        d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z"
        fill={featured ? "currentColor" : "#18181B"}
      />
    </svg>
  );
}

export default function PricingCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {pricingPlans.map((plan) => (
        <article
          key={plan.name}
          className={`border p-6 md:p-8 ${
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
              <h3 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
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
              <span className="border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white">
                Pro
              </span>
            ) : null}
          </div>

          <p
            className={`mt-4 max-w-md text-base leading-7 ${
              plan.featured ? "text-zinc-300" : "text-zinc-700"
            }`}
          >
            {plan.description}
          </p>

          <ul className="mt-8 space-y-3 text-sm">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className={plan.featured ? "text-white" : "text-zinc-950"}>
                  <CheckIcon featured={plan.featured} />
                </span>
                <span className={plan.featured ? "text-zinc-100" : "text-zinc-800"}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <Button
            asChild
            size="lg"
            className={`mt-8 h-12 w-full rounded-sm border px-6 text-sm ${
              plan.featured
                ? "border-white bg-white text-zinc-950 hover:bg-zinc-200"
                : "border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800"
            }`}
          >
            <Link href={plan.ctaHref}>{plan.ctaLabel}</Link>
          </Button>
        </article>
      ))}
    </div>
  );
}
