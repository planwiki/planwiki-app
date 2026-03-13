import { router } from "./trpc";
import { workspacesRouter } from "./routers/workspaces";

export const appRouter = router({
  workspaces: workspacesRouter,
});

export type AppRouter = typeof appRouter;
