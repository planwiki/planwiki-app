import { z } from "zod"

import {
  WIDGET_REGISTRY,
  WORKSPACE_WIDGET_TYPES,
} from "@/lib/widgets/widget-registry"

const widgetRegistryEntryContextSchema = z.object({
  type: z.enum(WORKSPACE_WIDGET_TYPES),
  label: z.string(),
  description: z.string(),
  layoutClassName: z.string(),
  renderer: z.object({
    component: z.string(),
    expectsInteractiveState: z.boolean(),
  }),
  requiredFields: z.array(z.string()),
  fieldDescriptions: z.record(z.string(), z.string()),
  generationRules: z.array(z.string()),
})

const outputContractSchema = z.object({
  topLevelShape: z.object({
    title: z.string(),
    summary: z.string(),
    widgets: z.string(),
  }),
  widgetArraySchemaName: z.string(),
  widgetTypes: z.array(z.enum(WORKSPACE_WIDGET_TYPES)),
  rules: z.array(z.string()),
})

const generatedWidgetItemSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1).nullable(),
  done: z.boolean().nullable(),
  name: z.string().min(1).nullable(),
  status: z.enum(["pending", "active", "done"]).nullable(),
  tasks: z.array(z.string().min(1)).nullable(),
})

const generatedWidgetSchema = z.object({
  id: z.string().min(1),
  type: z.enum(WORKSPACE_WIDGET_TYPES),
  order: z.number().int(),
  title: z.string().min(1).nullable(),
  items: z.array(generatedWidgetItemSchema).nullable(),
  columns: z.array(z.string().min(1)).nullable(),
  rows: z.array(z.array(z.string())).nullable(),
  content: z.string().nullable(),
})

export const generatedWorkspaceSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  widgets: z.array(generatedWidgetSchema).min(1),
})

export const workspaceGeneratorContextSchema = z
  .object({
    widgetRegistry: z.array(widgetRegistryEntryContextSchema),
    outputContract: outputContractSchema,
  })
  .default({
    widgetRegistry: [
      {
        type: "checklist",
        label: WIDGET_REGISTRY.checklist.label,
        description: WIDGET_REGISTRY.checklist.description,
        layoutClassName: WIDGET_REGISTRY.checklist.className,
        renderer: {
          component: "ChecklistWidget",
          expectsInteractiveState: true,
        },
        requiredFields: ["id", "type", "order", "title", "items"],
        fieldDescriptions: {
          id: "Stable widget id string.",
          type: "Must be `checklist`.",
          order: "Numeric sort order in the workspace.",
          title: "Short widget heading shown in the card header.",
          items: "Array of checklist items with `id`, `text`, and `done`.",
        },
        generationRules: [
          "Create 3 to 8 concise, actionable items.",
          "Mark `done` true only when the source text clearly implies completion.",
          "Keep item text short enough to scan in a list.",
        ],
      },
      {
        type: "phases",
        label: WIDGET_REGISTRY.phases.label,
        description: WIDGET_REGISTRY.phases.description,
        layoutClassName: WIDGET_REGISTRY.phases.className,
        renderer: {
          component: "PhasesWidget",
          expectsInteractiveState: false,
        },
        requiredFields: ["id", "type", "order", "title", "items"],
        fieldDescriptions: {
          id: "Stable widget id string.",
          type: "Must be `phases`.",
          order: "Numeric sort order in the workspace.",
          title: "Short widget heading shown in the card header.",
          items:
            "Array of phase items with `id`, `name`, `status`, and `tasks`.",
        },
        generationRules: [
          "Use 2 to 5 phases that represent a real sequence.",
          "Set `status` to one of `pending`, `active`, or `done`.",
          "Each phase should have 1 to 4 tasks.",
        ],
      },
      {
        type: "table",
        label: WIDGET_REGISTRY.table.label,
        description: WIDGET_REGISTRY.table.description,
        layoutClassName: WIDGET_REGISTRY.table.className,
        renderer: {
          component: "TableWidget",
          expectsInteractiveState: true,
        },
        requiredFields: ["id", "type", "order", "title", "columns", "rows"],
        fieldDescriptions: {
          id: "Stable widget id string.",
          type: "Must be `table`.",
          order: "Numeric sort order in the workspace.",
          title: "Short widget heading shown in the card header.",
          columns: "Ordered array of column labels.",
          rows: "Array of row arrays. Each row should align with `columns`.",
        },
        generationRules: [
          "Use when the source has structured comparisons, budgets, or references.",
          "Make every row the same width as the columns array.",
          "Prefer 2 to 6 rows and concise cell values.",
        ],
      },
      {
        type: "notes",
        label: WIDGET_REGISTRY.notes.label,
        description: WIDGET_REGISTRY.notes.description,
        layoutClassName: WIDGET_REGISTRY.notes.className,
        renderer: {
          component: "NotesWidget",
          expectsInteractiveState: false,
        },
        requiredFields: ["id", "type", "order", "title", "content"],
        fieldDescriptions: {
          id: "Stable widget id string.",
          type: "Must be `notes`.",
          order: "Numeric sort order in the workspace.",
          title: "Short widget heading shown in the card header.",
          content: "Short paragraph that frames the workspace.",
        },
        generationRules: [
          "Use plain text only.",
          "Keep the note to a short summary paragraph.",
          "Do not duplicate every detail already present in other widgets.",
        ],
      },
    ],
    outputContract: {
      topLevelShape: {
        title: "string",
        summary: "string",
        widgets: "WorkspaceWidget[]",
      },
      widgetArraySchemaName: "workspaceWidgetsSchema",
      widgetTypes: [...WORKSPACE_WIDGET_TYPES],
      rules: [
        "Return strict JSON only.",
        "Every widget must use one of the declared widget types.",
        "Every widget must include the required fields for its type.",
        "The renderer selects components by `widget.type`, so field names must match exactly.",
        "Sort widgets with ascending `order` values starting at 1.",
      ],
    },
  })

export type WorkspaceGeneratorContext = z.infer<
  typeof workspaceGeneratorContextSchema
>

export const createWorkspaceGeneratorContext = (): WorkspaceGeneratorContext =>
  workspaceGeneratorContextSchema.parse({
    widgetRegistry: [
      {
        type: "checklist",
        label: WIDGET_REGISTRY.checklist.label,
        description: WIDGET_REGISTRY.checklist.description,
        layoutClassName: WIDGET_REGISTRY.checklist.className,
        renderer: {
          component: "ChecklistWidget",
          expectsInteractiveState: true,
        },
        requiredFields: ["id", "type", "order", "title", "items"],
        fieldDescriptions: {
          id: "Stable widget id string.",
          type: "Must be `checklist`.",
          order: "Numeric sort order in the workspace.",
          title: "Short widget heading shown in the card header.",
          items: "Array of checklist items with `id`, `text`, and `done`.",
        },
        generationRules: [
          "Create 3 to 8 concise, actionable items.",
          "Mark `done` true only when the source text clearly implies completion.",
          "Keep item text short enough to scan in a list.",
        ],
      },
      {
        type: "phases",
        label: WIDGET_REGISTRY.phases.label,
        description: WIDGET_REGISTRY.phases.description,
        layoutClassName: WIDGET_REGISTRY.phases.className,
        renderer: {
          component: "PhasesWidget",
          expectsInteractiveState: false,
        },
        requiredFields: ["id", "type", "order", "title", "items"],
        fieldDescriptions: {
          id: "Stable widget id string.",
          type: "Must be `phases`.",
          order: "Numeric sort order in the workspace.",
          title: "Short widget heading shown in the card header.",
          items:
            "Array of phase items with `id`, `name`, `status`, and `tasks`.",
        },
        generationRules: [
          "Use 2 to 5 phases that represent a real sequence.",
          "Set `status` to one of `pending`, `active`, or `done`.",
          "Each phase should have 1 to 4 tasks.",
        ],
      },
      {
        type: "table",
        label: WIDGET_REGISTRY.table.label,
        description: WIDGET_REGISTRY.table.description,
        layoutClassName: WIDGET_REGISTRY.table.className,
        renderer: {
          component: "TableWidget",
          expectsInteractiveState: true,
        },
        requiredFields: ["id", "type", "order", "title", "columns", "rows"],
        fieldDescriptions: {
          id: "Stable widget id string.",
          type: "Must be `table`.",
          order: "Numeric sort order in the workspace.",
          title: "Short widget heading shown in the card header.",
          columns: "Ordered array of column labels.",
          rows: "Array of row arrays. Each row should align with `columns`.",
        },
        generationRules: [
          "Use when the source has structured comparisons, budgets, or references.",
          "Make every row the same width as the columns array.",
          "Prefer 2 to 6 rows and concise cell values.",
        ],
      },
      {
        type: "notes",
        label: WIDGET_REGISTRY.notes.label,
        description: WIDGET_REGISTRY.notes.description,
        layoutClassName: WIDGET_REGISTRY.notes.className,
        renderer: {
          component: "NotesWidget",
          expectsInteractiveState: false,
        },
        requiredFields: ["id", "type", "order", "title", "content"],
        fieldDescriptions: {
          id: "Stable widget id string.",
          type: "Must be `notes`.",
          order: "Numeric sort order in the workspace.",
          title: "Short widget heading shown in the card header.",
          content: "Short paragraph that frames the workspace.",
        },
        generationRules: [
          "Use plain text only.",
          "Keep the note to a short summary paragraph.",
          "Do not duplicate every detail already present in other widgets.",
        ],
      },
    ],
    outputContract: {
      topLevelShape: {
        title: "string",
        summary: "string",
        widgets: "WorkspaceWidget[]",
      },
      widgetArraySchemaName: "workspaceWidgetsSchema",
      widgetTypes: [...WORKSPACE_WIDGET_TYPES],
      rules: [
        "Return strict JSON only.",
        "Every widget must use one of the declared widget types.",
        "Every widget must include the required fields for its type.",
        "The renderer selects components by `widget.type`, so field names must match exactly.",
        "Sort widgets with ascending `order` values starting at 1.",
      ],
    },
  })

export const defaultWorkspaceGeneratorContext = createWorkspaceGeneratorContext()
