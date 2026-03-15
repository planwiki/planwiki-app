import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { WelcomeOnboarding } from "@/components/welcome-onboarding";
import { auth } from "@/lib/auth";

export default async function WelcomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <WelcomeOnboarding
      userName={session.user.name}
      userEmail={session.user.email}
    />
  );
}
