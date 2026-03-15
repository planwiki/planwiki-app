import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms | PlanWiki",
  description: "Terms of use for PlanWiki.",
};

const sections = [
  {
    title: "Using PlanWiki",
    body: [
      "PlanWiki lets you turn AI-generated plans into structured workspaces, visual blocks, and shareable pages. You may use the product only in compliance with applicable law and in a way that does not interfere with the service for other users.",
      "You are responsible for the content you paste, create, or publish through the product. That includes confirming you have the right to use any material you upload or share.",
    ],
  },
  {
    title: "Accounts and access",
    body: [
      "You are responsible for maintaining the security of your account and any credentials connected to it. If you believe your account has been compromised, you should stop using the affected session and contact the team promptly.",
      "We may suspend or restrict access if we believe an account is being used for abuse, fraud, unlawful activity, or behavior that threatens the stability of the service.",
    ],
  },
  {
    title: "Content and ownership",
    body: [
      "You retain ownership of the content you submit to PlanWiki. By using the service, you grant PlanWiki permission to host, process, and display that content only as needed to operate the product and provide features you request.",
      "PlanWiki retains ownership of the application, branding, code, and product-specific materials except where an open source license explicitly says otherwise.",
    ],
  },
  {
    title: "Availability and changes",
    body: [
      "The service may evolve over time. We may update features, pricing, limits, or the way parts of the product work. We may also modify or discontinue features when necessary.",
      "PlanWiki is provided on an as-available basis. We do not guarantee uninterrupted access, permanent storage, or fitness for a particular purpose.",
    ],
  },
  {
    title: "Liability",
    body: [
      "To the maximum extent allowed by law, PlanWiki will not be liable for indirect, incidental, special, consequential, or punitive damages arising from your use of the product.",
      "You use outputs, plans, and published pages at your own discretion. You are responsible for reviewing generated or transformed content before relying on it.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Use"
      summary="These terms govern access to PlanWiki and explain the responsibilities that come with using the product."
      effectiveDate="March 15, 2026"
      sections={sections}
    />
  );
}
