import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";

import {
  WORKSPACE_GENERATOR_MODEL,
  buildGenerateNewWorkspacePrompt,
  buildUpdateWorkspacePrompt,
  createWorkspaceGeneratorContext,
  formatWorkspaceMessageHistory,
  generateWorkspaceWithAgent,
} from "@/lib/agents/workspace-generator";
import { db } from "@/lib/db";
import { messages, workspaces } from "@/lib/db/schema";
import {
  coerceWidgetId,
  workspaceWidgetSchema,
  type WorkspaceWidget,
} from "@/lib/widgets/widget-registry";
import { privateProcedure, publicProcedure, router } from "@/server/trpc";

const sortWidgets = (widgets: WorkspaceWidget[]) =>
  [...widgets].sort((left, right) => left.order - right.order);

const normalizeGeneratedWidgets = (
  widgets: Awaited<
    ReturnType<typeof generateWorkspaceWithAgent>
  >["output"]["widgets"],
): WorkspaceWidget[] =>
  widgets.map((widget, index) => {
    const base = {
      id: coerceWidgetId(widget.id),
      type: widget.type,
      order: widget.order ?? index + 1,
      title: widget.title ?? null,
    };

    switch (widget.type) {
      case "checklist":
        return {
          ...base,
          type: "checklist" as const,
          items:
            widget.items
              ?.map((item, itemIndex) => ({
                id: coerceWidgetId(item.id),
                text:
                  typeof item.text === "string" && item.text.trim()
                    ? item.text
                    : `Checklist item ${itemIndex + 1}`,
                done: Boolean(item.done),
              }))
              .filter((item) => item.text.trim().length > 0) ?? [],
        };
      case "phases":
        return {
          ...base,
          type: "phases" as const,
          items:
            widget.items?.map((item, itemIndex) => ({
              id: coerceWidgetId(item.id),
              name:
                typeof item.name === "string" && item.name.trim()
                  ? item.name
                  : `Phase ${itemIndex + 1}`,
              status:
                item.status === "done" ||
                item.status === "active" ||
                item.status === "pending"
                  ? item.status
                  : "pending",
              tasks:
                item.tasks?.filter(
                  (task) => typeof task === "string" && task.trim(),
                ) ?? [],
            })) ?? [],
        };
      case "table":
        return {
          ...base,
          type: "table" as const,
          columns: widget.columns ?? [],
          rows: widget.rows ?? [],
          selectedRows: [],
        };
      case "notes":
      default:
        return {
          ...base,
          type: "notes" as const,
          content: widget.content ?? "",
        };
    }
  });

const loadWorkspaceMessages = async (workspaceId: string) => {
  return db.query.messages.findMany({
    where: eq(messages.workspaceId, workspaceId),
    orderBy: asc(messages.createdAt),
  });
};

export const workspacesRouter = router({
  list: privateProcedure.query(async ({ ctx }) => {
    const userWorkspaces = await db.query.workspaces.findMany({
      where: eq(workspaces.userId, ctx.user!.id),
      orderBy: (table, { desc }) => [desc(table.updatedAt)],
    });

    return userWorkspaces.map((workspace) => ({
      id: workspace.id,
      title: workspace.title ?? "Untitled workspace",
      slug: workspace.slug,
      updatedAt: workspace.updatedAt,
    }));
  }),

  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.slug, input.slug),
      });

      if (!workspace) {
        return null;
      }

      const workspaceMessages = await loadWorkspaceMessages(workspace.id);

      return {
        workspace,
        messages: workspaceMessages,
      };
    }),

  generateNewWorkspace: privateProcedure
    .input(
      z.object({
        text: z
          .string()
          .trim()
          .min(
            50,
            "Your plan is too short. Paste more detail before continuing.",
          ),
        source: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [workspace] = await db
        .insert(workspaces)
        .values({
          userId: ctx.user!.id,
          title: null,
          widgets: [],
        })
        .returning();

      if (!workspace) {
        return {
          success: false as const,
          error: "failed_to_generate",
        };
      }

      try {
        let generatedData:
          | {
              title: string;
              summary: string;
              widgets: WorkspaceWidget[];
            }
          | undefined;

        let updatedWorkspace: typeof workspace | undefined;

        await db.transaction(async (tx) => {
          await tx.insert(messages).values({
            workspaceId: workspace.id,
            role: "user",
            content: {
              text: input.text,
              source: input.source,
            },
          });

          const startedAt = Date.now();
          const { output } = await generateWorkspaceWithAgent({
            prompt: buildGenerateNewWorkspacePrompt(input.text),
            context: createWorkspaceGeneratorContext(),
          });
          const widgets = sortWidgets(
            normalizeGeneratedWidgets(output.widgets),
          );
          const durationMs = Date.now() - startedAt;

          await tx.insert(messages).values({
            workspaceId: workspace.id,
            role: "assistant",
            content: {
              widgets,
            },
            metadata: {
              model: WORKSPACE_GENERATOR_MODEL,
              durationMs,
            },
          });

          const [nextWorkspace] = await tx
            .update(workspaces)
            .set({
              title: output.title,
              widgets,
            })
            .where(eq(workspaces.id, workspace.id))
            .returning();

          if (!nextWorkspace) {
            throw new Error("Failed to update workspace");
          }

          generatedData = {
            title: output.title,
            summary: output.summary,
            widgets,
          };
          updatedWorkspace = nextWorkspace;
        });

        if (!generatedData || !updatedWorkspace) {
          return {
            success: false as const,
            error: "failed_to_generate",
          };
        }

        const workspaceMessages = await loadWorkspaceMessages(
          updatedWorkspace.id,
        );

        return {
          success: true as const,
          data: {
            ...generatedData,
            workspaceId: updatedWorkspace.id,
            slug: updatedWorkspace.slug,
          },
          workspace: updatedWorkspace,
          messages: workspaceMessages,
        };
      } catch (error) {
        console.error("Error generating workspace", { error: error });
        await db.delete(workspaces).where(eq(workspaces.id, workspace.id));

        return {
          success: false as const,
          error: "failed_to_generate",
        };
      }
    }),

  updateWorkspace: privateProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        text: z
          .string()
          .trim()
          .min(
            50,
            "Your plan is too short. Paste more detail before continuing.",
          ),
        source: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workspace = await db.query.workspaces.findFirst({
        where: and(
          eq(workspaces.id, input.workspaceId),
          eq(workspaces.userId, ctx.user!.id),
        ),
      });

      if (!workspace) {
        return {
          success: false as const,
          error: "workspace_not_found",
        };
      }

      try {
        let generatedData:
          | {
              title: string;
              summary: string;
              widgets: WorkspaceWidget[];
            }
          | undefined;

        let updatedWorkspace: typeof workspace | undefined;

        await db.transaction(async (tx) => {
          await tx.insert(messages).values({
            workspaceId: workspace.id,
            role: "user",
            content: {
              text: input.text,
              source: input.source,
            },
          });

          const history = await tx
            .select({
              role: messages.role,
              content: messages.content,
              metadata: messages.metadata,
              createdAt: messages.createdAt,
            })
            .from(messages)
            .where(eq(messages.workspaceId, workspace.id))
            .orderBy(asc(messages.createdAt));
          const formattedHistory = history.map((message) => ({
            ...message,
            createdAt: message.createdAt ?? new Date().toISOString(),
          }));

          const startedAt = Date.now();
          const { output } = await generateWorkspaceWithAgent({
            prompt: buildUpdateWorkspacePrompt({
              text: input.text,
              currentWidgets: (workspace.widgets ?? []) as WorkspaceWidget[],
              messageHistory: formatWorkspaceMessageHistory(formattedHistory),
            }),
            context: createWorkspaceGeneratorContext(),
          });
          const widgets = sortWidgets(
            normalizeGeneratedWidgets(output.widgets),
          );
          const durationMs = Date.now() - startedAt;

          await tx.insert(messages).values({
            workspaceId: workspace.id,
            role: "assistant",
            content: {
              widgets,
            },
            metadata: {
              model: WORKSPACE_GENERATOR_MODEL,
              durationMs,
            },
          });

          const [nextWorkspace] = await tx
            .update(workspaces)
            .set({
              title: output.title,
              widgets,
            })
            .where(eq(workspaces.id, workspace.id))
            .returning();

          if (!nextWorkspace) {
            throw new Error("Failed to update workspace");
          }

          generatedData = {
            title: output.title,
            summary: output.summary,
            widgets,
          };
          updatedWorkspace = nextWorkspace;
        });

        if (!generatedData || !updatedWorkspace) {
          return {
            success: false as const,
            error: "failed_to_generate",
          };
        }

        const workspaceMessages = await loadWorkspaceMessages(
          updatedWorkspace.id,
        );

        return {
          success: true as const,
          data: {
            ...generatedData,
            workspaceId: updatedWorkspace.id,
            slug: updatedWorkspace.slug,
          },
          workspace: updatedWorkspace,
          messages: workspaceMessages,
        };
      } catch {
        return {
          success: false as const,
          error: "failed_to_generate",
        };
      }
    }),

  renameWorkspace: privateProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        title: z.string().trim().min(1).max(120),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [workspace] = await db
        .update(workspaces)
        .set({
          title: input.title,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(workspaces.id, input.workspaceId),
            eq(workspaces.userId, ctx.user!.id),
          ),
        )
        .returning();

      if (!workspace) {
        return {
          success: false as const,
          error: "workspace_not_found",
        };
      }

      return {
        success: true as const,
        data: {
          id: workspace.id,
          title: workspace.title ?? "Untitled workspace",
          slug: workspace.slug,
        },
      };
    }),

  setWorkspaceVisibility: privateProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        isPublic: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [workspace] = await db
        .update(workspaces)
        .set({
          isPublic: input.isPublic,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(workspaces.id, input.workspaceId),
            eq(workspaces.userId, ctx.user!.id),
          ),
        )
        .returning();

      if (!workspace) {
        return {
          success: false as const,
          error: "workspace_not_found",
        };
      }

      return {
        success: true as const,
        data: {
          id: workspace.id,
          slug: workspace.slug,
          isPublic: Boolean(workspace.isPublic),
        },
      };
    }),

  deleteWorkspace: privateProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [workspace] = await db
        .delete(workspaces)
        .where(
          and(
            eq(workspaces.id, input.workspaceId),
            eq(workspaces.userId, ctx.user!.id),
          ),
        )
        .returning();

      if (!workspace) {
        return {
          success: false as const,
          error: "workspace_not_found",
        };
      }

      return {
        success: true as const,
        data: {
          id: workspace.id,
          slug: workspace.slug,
        },
      };
    }),

  saveWidgetState: privateProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        widgets: z.array(workspaceWidgetSchema),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workspace = await db.query.workspaces.findFirst({
        where: and(
          eq(workspaces.id, input.workspaceId),
          eq(workspaces.userId, ctx.user!.id),
        ),
      });

      if (!workspace) {
        return {
          success: false as const,
          error: "workspace_not_found",
        };
      }

      const widgets = sortWidgets(input.widgets as WorkspaceWidget[]);

      const [nextWorkspace] = await db
        .update(workspaces)
        .set({
          widgets,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(workspaces.id, workspace.id))
        .returning();

      if (!nextWorkspace) {
        return {
          success: false as const,
          error: "workspace_not_found",
        };
      }

      return {
        success: true as const,
        data: {
          widgets,
        },
      };
    }),
});
