import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { messages, workspaces } from "@/lib/db/schema";
import {
  allowedWidgetTypes,
  coerceWidgetId,
  type PhaseItem,
  type WorkspaceWidget,
} from "@/lib/widgets/widget-registry";
import { privateProcedure, publicProcedure, router } from "@/server/trpc";
import { azure } from "@ai-sdk/azure";
import { generateText } from "ai";

const assistantPrompt = (planText: string) => `
You turn messy AI plans into a small set of structured widgets.

You can ONLY use these widget types: ${allowedWidgetTypes.join(", ")}.

Return STRICT JSON with this exact shape:
{
  "widgets": [
    {
      "id": "string",
      "type": "checklist" | "phases" | "table" | "notes",
      "order": 1,
      "title": "short title"
    }
  ]
}

Do not include any markdown. Do not include explanations. The field "data" can contain any additional JSON you need to render the widget.

Plan text:
"""${planText}"""`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readString = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value : fallback;

const readStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

const readChecklistItems = (value: unknown) =>
  Array.isArray(value)
    ? value
        .filter(isRecord)
        .map((item, index) => ({
          id: coerceWidgetId(typeof item.id === "string" ? item.id : undefined),
          text: readString(item.text, `Checklist item ${index + 1}`),
          done: Boolean(item.done),
        }))
    : [];

const readPhaseItems = (value: unknown): PhaseItem[] =>
  Array.isArray(value)
    ? value
        .filter(isRecord)
        .map((item, index) => ({
          id: coerceWidgetId(typeof item.id === "string" ? item.id : undefined),
          name: readString(item.name, `Phase ${index + 1}`),
          status:
            item.status === "done" ||
            item.status === "active" ||
            item.status === "pending"
              ? item.status
              : "pending",
          tasks: readStringArray(item.tasks),
        }))
    : [];

const readRows = (value: unknown) =>
  Array.isArray(value) ? value.map((row) => readStringArray(row)) : [];

const loadWorkspaceMessages = async (workspaceId: string) => {
  return db.query.messages.findMany({
    where: eq(messages.workspaceId, workspaceId),
    orderBy: asc(messages.createdAt),
  });
};

export const workspacesRouter = router({
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

  generateFromText: privateProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        text: z.string().min(1, "Paste some AI output to generate widgets."),
        mode: z.string().optional(),
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
        throw new Error("Workspace not found or you do not have access.");
      }

      const aiResult = await generateText({
        model: azure("gpt-4.1-mini"),
        prompt: assistantPrompt(input.text),
      });

      let widgets: WorkspaceWidget[] = [];

      try {
        const parsed = JSON.parse(aiResult.text) as {
          widgets?: Array<Record<string, unknown>>;
        };

        if (Array.isArray(parsed.widgets)) {
          widgets = parsed.widgets
            .map((raw, index) => {
              const type = allowedWidgetTypes.includes(
                raw.type as (typeof allowedWidgetTypes)[number],
              )
                ? (raw.type as WorkspaceWidget["type"])
                : "notes";
              const base = {
                id: coerceWidgetId(
                  typeof raw.id === "string" ? raw.id : undefined,
                ),
                type,
                order: typeof raw.order === "number" ? raw.order : index + 1,
                title: readString(raw.title, workspace.title ?? "Workspace widget"),
              };

              switch (type) {
                case "checklist":
                  return {
                    ...base,
                    type,
                    items: readChecklistItems(raw.items),
                  } satisfies WorkspaceWidget;
                case "phases":
                  return {
                    ...base,
                    type,
                    items: readPhaseItems(raw.items),
                  } satisfies WorkspaceWidget;
                case "table":
                  return {
                    ...base,
                    type,
                    columns: readStringArray(raw.columns),
                    rows: readRows(raw.rows),
                  } satisfies WorkspaceWidget;
                case "notes":
                default:
                  return {
                    ...base,
                    type: "notes" as const,
                    content: readString(raw.content, input.text),
                  } satisfies WorkspaceWidget;
              }
            })
            .filter((widget) => allowedWidgetTypes.includes(widget.type as never));
        }
      } catch {
        widgets = [
          {
            id: coerceWidgetId(),
            type: "notes",
            order: 1,
            title: workspace.title ?? "Workspace notes",
            content: input.text,
          },
        ];
      }

      const [updatedWorkspace] = await db
        .update(workspaces)
        .set({ widgets })
        .where(eq(workspaces.id, workspace.id))
        .returning();

      if (!updatedWorkspace) {
        throw new Error("Failed to update workspace.");
      }

      await db.insert(messages).values([
        {
          workspaceId: workspace.id,
          role: "user",
          content: {
            type: "text",
            text: input.text,
            mode: input.mode,
            source: input.source,
          },
        },
        {
          workspaceId: workspace.id,
          role: "assistant",
          content: {
            type: "widgets",
            widgets,
          },
        },
      ]);

      const workspaceMessages = await loadWorkspaceMessages(workspace.id);

      return {
        workspace: updatedWorkspace,
        messages: workspaceMessages,
      };
    }),
});
