import Link from "next/link";

type LegalSection = {
  title: string;
  body: string[];
};

interface LegalPageProps {
  eyebrow: string;
  title: string;
  summary: string;
  effectiveDate: string;
  sections: LegalSection[];
}

export function LegalPage({
  eyebrow,
  title,
  summary,
  effectiveDate,
  sections,
}: LegalPageProps) {
  return (
    <main className="min-h-screen bg-[#f6f1e8] text-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
        <div className="border border-zinc-950/10 bg-white/70 p-6 backdrop-blur-sm md:p-10">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.28em] text-zinc-500 transition-colors hover:text-zinc-950"
          >
            Back to home
          </Link>

          <div className="mt-8 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              {title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-zinc-700">{summary}</p>
            <p className="mt-6 border-t border-zinc-950/10 pt-4 text-sm text-zinc-600">
              Effective date: {effectiveDate}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {sections.map((section) => (
            <section
              key={section.title}
              className="border border-zinc-950/10 bg-white/80 p-6 md:p-8"
            >
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-zinc-700">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
