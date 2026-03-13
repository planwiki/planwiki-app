import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { initTRPC, TRPCError } from "@trpc/server";

import { getServerSession } from "next-auth";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

export const privateProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Please sign in to continue",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: session.user,
    },
  });
});
