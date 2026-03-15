import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { onboarding } from "@/lib/db/schema"
import { privateProcedure, router } from "@/server/trpc"

export const authRouter = router({
  getOnboardingStatus: privateProcedure.query(async ({ ctx }) => {
    const onboardingRow = await db.query.onboarding.findFirst({
      where: eq(onboarding.userId, ctx.user!.id),
    })

    return {
      hasSeenOnboarding: onboardingRow?.hasSeenOnboarding ?? false,
    }
  }),
})
