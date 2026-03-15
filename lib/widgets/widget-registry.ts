import { nanoid } from "nanoid"
import type { ComponentType } from "react"
import { z } from "zod"

import { ChecklistWidget } from "@/components/widgets/checklist-widget"
import { NotesWidget } from "@/components/widgets/notes-widget"
import { PhasesWidget } from "@/components/widgets/phases-widget"
import { TableWidget } from "@/components/widgets/table-widget"

export const WORKSPACE_WIDGET_TYPES = [
  "checklist",
  "phases",
  "table",
  "notes",
] as const

export type WorkspaceWidgetType = (typeof WORKSPACE_WIDGET_TYPES)[number]

export interface ChecklistItem {
  id: string
  text: string
  done: boolean
}

export interface PhaseItem {
  id: string
  name: string
  status: "pending" | "active" | "done"
  tasks: string[]
}

export interface WorkspaceWidgetBase<
  TType extends WorkspaceWidgetType = WorkspaceWidgetType,
> {
  id: string
  type: TType
  order: number
  title: string | null
  data?: unknown
}

export interface ChecklistWidgetData
  extends WorkspaceWidgetBase<"checklist"> {
  items: ChecklistItem[]
}

export interface PhasesWidgetData extends WorkspaceWidgetBase<"phases"> {
  items: PhaseItem[]
}

export interface TableWidgetData extends WorkspaceWidgetBase<"table"> {
  columns: string[]
  rows: string[][]
  selectedRows?: number[]
}

export interface NotesWidgetData extends WorkspaceWidgetBase<"notes"> {
  content: string
}

export type WorkspaceWidget =
  | ChecklistWidgetData
  | PhasesWidgetData
  | TableWidgetData
  | NotesWidgetData

export interface WidgetComponentProps {
  widget: WorkspaceWidget
  onChecklistItemToggle?: (widgetId: string, itemId: string) => void
  onPhaseStatusChange?: (widgetId: string, phaseId: string) => void
  selectedTableRows?: number[]
  onTableRowToggle?: (widgetId: string, rowIndex: number) => void
}

export const checklistItemSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  done: z.boolean(),
})

export const phaseItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(["pending", "active", "done"]),
  tasks: z.array(z.string().min(1)),
})

const workspaceWidgetBaseSchema = z.object({
  id: z.string().min(1),
  order: z.number().int(),
  title: z.string().min(1).nullable(),
})

export const checklistWidgetSchema = workspaceWidgetBaseSchema.extend({
  type: z.literal("checklist"),
  items: z.array(checklistItemSchema),
})

export const phasesWidgetSchema = workspaceWidgetBaseSchema.extend({
  type: z.literal("phases"),
  items: z.array(phaseItemSchema),
})

export const tableWidgetSchema = workspaceWidgetBaseSchema.extend({
  type: z.literal("table"),
  columns: z.array(z.string().min(1)),
  rows: z.array(z.array(z.string())),
  selectedRows: z.array(z.number().int().min(0)).optional(),
})

export const notesWidgetSchema = workspaceWidgetBaseSchema.extend({
  type: z.literal("notes"),
  content: z.string(),
})

export const workspaceWidgetSchema = z.discriminatedUnion("type", [
  checklistWidgetSchema,
  phasesWidgetSchema,
  tableWidgetSchema,
  notesWidgetSchema,
])

export const workspaceWidgetsSchema = z.array(workspaceWidgetSchema)

type WidgetRegistryEntry<TType extends WorkspaceWidgetType> = {
  type: TType
  label: string
  description: string
  className: string
  component: ComponentType<WidgetComponentProps>
}

export const WIDGET_REGISTRY: Record<
  WorkspaceWidgetType,
  WidgetRegistryEntry<WorkspaceWidgetType>
> = {
  checklist: {
    type: "checklist",
    label: "Checklist",
    description: "Tasks and steps extracted from the plan.",
    className: "lg:col-span-5 xl:col-span-4",
    component: ChecklistWidget,
  },
  phases: {
    type: "phases",
    label: "Phases",
    description: "Major milestones, momentum, and task clusters.",
    className: "lg:col-span-7 xl:col-span-8",
    component: PhasesWidget,
  },
  table: {
    type: "table",
    label: "Table",
    description: "Structured references, comparisons, and budgets.",
    className: "lg:col-span-12",
    component: TableWidget,
  },
  notes: {
    type: "notes",
    label: "Notes",
    description: "Compact context and framing for the workspace.",
    className: "lg:col-span-12",
    component: NotesWidget,
  },
}

export const allowedWidgetTypes = Object.keys(
  WIDGET_REGISTRY,
) as WorkspaceWidgetType[]

export const coerceWidgetId = (id?: string | null) => id || nanoid()
