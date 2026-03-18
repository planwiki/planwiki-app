import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";

import { WelcomeOnboarding } from "@/components/welcome-onboarding";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";

const getAppOrigin = async () => {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const host = forwardedHost ?? requestHeaders.get("host") ?? "localhost:3000";
  const forwardedProto = requestHeaders.get("x-forwarded-proto");
  const protocol =
    forwardedProto ?? (host.includes("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
};

export default async function WelcomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const [userApiKeys, appOrigin] = await Promise.all([
    db.query.apiKeys.findMany({
      where: eq(apiKeys.userId, session.user.id),
      orderBy: desc(apiKeys.createdAt),
    }),
    getAppOrigin(),
  ]);

  return (
    <WelcomeOnboarding
      userName={session.user.name}
      userEmail={session.user.email}
      mcpUrl={`${appOrigin}/api/mcp`}
      initialKeys={userApiKeys.map((key) => ({
        id: key.id,
        name: key.name,
        apiKey: key.apiKey,
        allowedWorkspaceIds: key.allowedWorkspaceIds ?? [],
        status: key.status,
        createdAt: key.createdAt,
        lastUsedAt: key.lastUsedAt,
      }))}
    />
  );
}
