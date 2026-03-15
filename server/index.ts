import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { workspacesRouter } from "./routers/workspaces";

export const appRouter = router({
  auth: authRouter,
  workspaces: workspacesRouter,
});

export type AppRouter = typeof appRouter;
