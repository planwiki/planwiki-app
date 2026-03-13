import type { WorkspaceWidget } from "@/lib/widgets/widget-registry"

export interface WorkspaceRow {
  id: string
  user_id: string
  title: string | null
  slug: string | null
  is_public: boolean | null
  widgets: WorkspaceWidget[] | null
  created_at: string | null
  updated_at: string | null
}

export interface MessageRow {
  id: string
  workspace_id: string
  role: "system" | "user" | "assistant"
  content: Record<string, unknown>
  metadata: Record<string, unknown> | null
  created_at: string | null
}

export interface WorkspacePlan {
  id: string
  userId: string
  title: string | null
  slug: string | null
  isPublic: boolean
  widgets: WorkspaceWidget[] | null
  createdAt: string | null
  updatedAt: string | null
}

export interface WorkspaceMessage {
  id: string
  workspaceId: string
  role: "system" | "user" | "assistant"
  content: Record<string, unknown>
  metadata: Record<string, unknown> | null
  createdAt: string | null
}

export interface WorkspaceWithMessages {
  workspace: WorkspacePlan
  messages: WorkspaceMessage[]
}

export function mapWorkspaceRow(row: WorkspaceRow): WorkspacePlan {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    slug: row.slug,
    isPublic: row.is_public ?? false,
    widgets: row.widgets,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapMessageRow(row: MessageRow): WorkspaceMessage {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    role: row.role,
    content: row.content,
    metadata: row.metadata,
    createdAt: row.created_at,
  }
}
