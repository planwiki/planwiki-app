import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy | PlanWiki",
  description: "Privacy policy for PlanWiki.",
};

const sections = [
  {
    title: "Information we collect",
    body: [
      "PlanWiki collects the information needed to operate the product, including account details, authentication data, workspace content you create or paste, and basic usage information such as device, browser, and log data.",
      "If you connect third-party services or sign in through an external provider, we may receive the profile and account details necessary to complete authentication and maintain your account.",
    ],
  },
  {
    title: "How we use information",
    body: [
      "We use your information to provide the service, authenticate users, render workspaces, support sharing and publishing features, improve reliability, and protect the product against abuse or misuse.",
      "We may also use aggregated and non-identifying usage information to understand product performance, diagnose issues, and guide product decisions.",
    ],
  },
  {
    title: "Sharing and disclosure",
    body: [
      "We do not sell your personal information. We may share information with infrastructure, hosting, analytics, authentication, and related service providers only to the extent necessary to run PlanWiki.",
      "We may also disclose information if required by law, to enforce our terms, or to protect the security, rights, and integrity of the product and its users.",
    ],
  },
  {
    title: "Public content and responsibility",
    body: [
      "If you publish or share a public PlanWiki page, the content you choose to expose may be visible to anyone with access to that link. You are responsible for reviewing public pages before sharing them.",
      "Avoid placing confidential, regulated, or sensitive personal information into public workspaces or shared pages unless you are certain that disclosure is appropriate.",
    ],
  },
  {
    title: "Retention and security",
    body: [
      "We retain information for as long as needed to provide the service, comply with legal obligations, resolve disputes, and enforce agreements. Retention periods may vary depending on the type of data and how the account is used.",
      "We use reasonable technical and organizational safeguards to protect information, but no system can guarantee absolute security.",
    ],
  },
  {
    title: "Policy updates",
    body: [
      "We may update this privacy policy from time to time. When we make material changes, we will update the effective date and publish the revised version on this page.",
      "Your continued use of PlanWiki after changes take effect means you accept the revised policy.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      summary="This policy explains what information PlanWiki collects, how it is used, and what responsibilities apply when you publish or share content."
      effectiveDate="March 15, 2026"
      sections={sections}
    />
  );
}
