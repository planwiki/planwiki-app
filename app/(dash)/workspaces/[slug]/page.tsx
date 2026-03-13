import { notFound } from "next/navigation";

import { WorkspaceCanvas } from "@/components/workspace-canvas";
import { findSampleWorkspaceBySlug } from "@/lib/widgets/sample-workspaces";

export default async function WorkspaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workspace = findSampleWorkspaceBySlug(slug);

  if (!workspace) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col">
      <WorkspaceCanvas workspace={workspace} />
    </main>
  );
}
