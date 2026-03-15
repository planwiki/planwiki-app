import { auth } from "@/lib/auth";
import { initTRPC, TRPCError } from "@trpc/server";

type Session = typeof auth.$Infer.Session;

export type TRPCContext = {
  headers: Headers;
  session: Session | null;
  user: Session["user"] | null;
};

export const createTRPCContext = async (opts: {
  headers: Headers;
}): Promise<TRPCContext> => {
  const session = await auth.api.getSession({
    headers: opts.headers,
  });

  return {
    headers: opts.headers,
    session,
    user: session?.user ?? null,
  };
};

const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

export const privateProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Please sign in to continue",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
    },
  });
});
