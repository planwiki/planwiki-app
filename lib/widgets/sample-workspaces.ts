import type { WorkspaceWidget } from "@/lib/widgets/widget-registry"

export interface SampleWorkspaceVersion {
  id: string
  label: string
  summary: string
  updatedAtLabel: string
  widgets: WorkspaceWidget[]
}

export interface SampleWorkspace {
  id: string
  slug: string
  title: string
  summary: string
  updatedAtLabel: string
  widgets: WorkspaceWidget[]
  versions: SampleWorkspaceVersion[]
}

export const sampleWorkspaces: SampleWorkspace[] = [
  {
    id: "sample-axerr-mvp-build",
    slug: "axerr-mvp-build",
    title: "Axerr MVP Build",
    summary:
      "A crisp shipping board for the first public release: align scope, lock the launch sequence, and keep the first customer loop visible.",
    updatedAtLabel: "Updated 2h ago",
    widgets: [
      {
        id: "axerr-phases",
        type: "phases",
        order: 1,
        title: "Launch timeline",
        items: [
          {
            id: "axerr-phase-1",
            name: "Week 1 - Core build",
            status: "done",
            tasks: ["Workspace shell", "Prompt capture", "Widget contract"],
          },
          {
            id: "axerr-phase-2",
            name: "Week 2 - Polish and QA",
            status: "active",
            tasks: ["Sample data pass", "Responsive review", "Detail page UI"],
          },
          {
            id: "axerr-phase-3",
            name: "Week 3 - Invite the first users",
            status: "pending",
            tasks: ["Landing cleanup", "3 design partner demos", "Feedback loop"],
          },
        ],
      },
      {
        id: "axerr-checklist",
        type: "checklist",
        order: 2,
        title: "Pre-flight checklist",
        items: [
          { id: "axerr-task-1", text: "Finalize the MVP scope", done: true },
          { id: "axerr-task-2", text: "Audit mobile layout on the workspace route", done: true },
          { id: "axerr-task-3", text: "Seed sample widgets for demo workspaces", done: false },
          { id: "axerr-task-4", text: "Write the launch walkthrough", done: false },
        ],
      },
      {
        id: "axerr-table",
        type: "table",
        order: 3,
        title: "Ownership matrix",
        columns: ["Lane", "Owner", "Definition of done"],
        rows: [
          ["Product", "Kupa", "Widget structure matches `plan.md`"],
          ["Design", "PlanWiki", "Dashboard feels calm but deliberate"],
          ["Launch", "Founders", "Three demo-ready workspace examples"],
        ],
      },
    ],
    versions: [
      {
        id: "axerr-v3",
        label: "Version 1",
        summary:
          "The latest draft tightens MVP scope around a clean launch sequence, interactive work tracking, and a sharper first-user loop.",
        updatedAtLabel: "Updated 2h ago",
        widgets: [
          {
            id: "axerr-phases",
            type: "phases",
            order: 1,
            title: "Launch timeline",
            items: [
              {
                id: "axerr-phase-1",
                name: "Week 1 - Core build",
                status: "done",
                tasks: ["Workspace shell", "Prompt capture", "Widget contract"],
              },
              {
                id: "axerr-phase-2",
                name: "Week 2 - Polish and QA",
                status: "active",
                tasks: ["Sample data pass", "Responsive review", "Detail page UI"],
              },
              {
                id: "axerr-phase-3",
                name: "Week 3 - Invite the first users",
                status: "pending",
                tasks: ["Landing cleanup", "3 design partner demos", "Feedback loop"],
              },
            ],
          },
          {
            id: "axerr-checklist",
            type: "checklist",
            order: 2,
            title: "Pre-flight checklist",
            items: [
              { id: "axerr-task-1", text: "Finalize the MVP scope", done: true },
              { id: "axerr-task-2", text: "Audit mobile layout on the workspace route", done: true },
              { id: "axerr-task-3", text: "Seed sample widgets for demo workspaces", done: false },
              { id: "axerr-task-4", text: "Write the launch walkthrough", done: false },
            ],
          },
          {
            id: "axerr-table",
            type: "table",
            order: 3,
            title: "Ownership matrix",
            columns: ["Lane", "Owner", "Definition of done"],
            rows: [
              ["Product", "Kupa", "Widget structure matches `plan.md`"],
              ["Design", "PlanWiki", "Dashboard feels calm but deliberate"],
              ["Launch", "Founders", "Three demo-ready workspace examples"],
            ],
          },
        ],
      },
      {
        id: "axerr-v2",
        label: "Version 2",
        summary:
          "An earlier version focused more on shell cleanup and less on user-facing launch work, with a smaller execution board.",
        updatedAtLabel: "Updated yesterday",
        widgets: [
          {
            id: "axerr-v2-checklist",
            type: "checklist",
            order: 1,
            title: "Build checklist",
            items: [
              { id: "axerr-v2-task-1", text: "Refine shell layout", done: true },
              { id: "axerr-v2-task-2", text: "Clean route structure", done: false },
              { id: "axerr-v2-task-3", text: "Prepare widget samples", done: false },
            ],
          },
          {
            id: "axerr-v2-table",
            type: "table",
            order: 2,
            title: "MVP scope cuts",
            columns: ["Keep", "Cut", "Why"],
            rows: [
              ["Checklist", "Advanced editing", "Keep the MVP operational"],
              ["Share links", "Permissions matrix", "Delay access control"],
              ["Versions", "Full history diff", "Show snapshots first"],
            ],
          },
        ],
      },
    ],
  },
  {
    id: "sample-launch-plan",
    slug: "launch-plan",
    title: "Launch Plan",
    summary:
      "A campaign workspace that keeps messaging, launch beats, and the last-mile checklist in one place for a compact founder team.",
    updatedAtLabel: "Updated today",
    widgets: [
      {
        id: "launch-notes",
        type: "notes",
        order: 1,
        title: "Campaign focus",
        content:
          "The story is simple: PlanWiki turns AI-generated plans into interfaces people can execute. This workspace keeps the public narrative, the daily launch beats, and the tactical checklist aligned.",
      },
      {
        id: "launch-checklist",
        type: "checklist",
        order: 2,
        title: "Launch day moves",
        items: [
          { id: "launch-task-1", text: "Publish launch thread", done: true },
          { id: "launch-task-2", text: "Post product walkthrough clip", done: false },
          { id: "launch-task-3", text: "Reply to all early comments", done: false },
          { id: "launch-task-4", text: "Collect first bug reports in one note", done: false },
        ],
      },
      {
        id: "launch-phases",
        type: "phases",
        order: 3,
        title: "Narrative arc",
        items: [
          {
            id: "launch-phase-1",
            name: "Before launch",
            status: "done",
            tasks: ["Core message", "Screenshot pass", "Landing copy"],
          },
          {
            id: "launch-phase-2",
            name: "Launch window",
            status: "active",
            tasks: ["Push announcements", "Support users live", "Monitor drop-off"],
          },
          {
            id: "launch-phase-3",
            name: "Follow-through",
            status: "pending",
            tasks: ["Post recap", "Schedule demos", "Prioritize fixes"],
          },
        ],
      },
      {
        id: "launch-table",
        type: "table",
        order: 4,
        title: "Channel plan",
        columns: ["Channel", "Primary asset", "Success signal"],
        rows: [
          ["X / Twitter", "Thread + looping clip", "Replies from builders"],
          ["Indie communities", "Compact demo post", "Qualified traffic"],
          ["Direct outreach", "Personalized note", "Booked intro calls"],
        ],
      },
    ],
    versions: [
      {
        id: "launch-v4",
        label: "Version 1",
        summary:
          "The launch draft keeps the message tight, makes the checklist executable, and tracks the live campaign response in one board.",
        updatedAtLabel: "Updated today",
        widgets: [
          {
            id: "launch-notes",
            type: "notes",
            order: 1,
            title: "Campaign focus",
            content:
              "The story is simple: PlanWiki turns AI-generated plans into interfaces people can execute. This workspace keeps the public narrative, the daily launch beats, and the tactical checklist aligned.",
          },
          {
            id: "launch-checklist",
            type: "checklist",
            order: 2,
            title: "Launch day moves",
            items: [
              { id: "launch-task-1", text: "Publish launch thread", done: true },
              { id: "launch-task-2", text: "Post product walkthrough clip", done: false },
              { id: "launch-task-3", text: "Reply to all early comments", done: false },
              { id: "launch-task-4", text: "Collect first bug reports in one note", done: false },
            ],
          },
          {
            id: "launch-phases",
            type: "phases",
            order: 3,
            title: "Narrative arc",
            items: [
              {
                id: "launch-phase-1",
                name: "Before launch",
                status: "done",
                tasks: ["Core message", "Screenshot pass", "Landing copy"],
              },
              {
                id: "launch-phase-2",
                name: "Launch window",
                status: "active",
                tasks: ["Push announcements", "Support users live", "Monitor drop-off"],
              },
              {
                id: "launch-phase-3",
                name: "Follow-through",
                status: "pending",
                tasks: ["Post recap", "Schedule demos", "Prioritize fixes"],
              },
            ],
          },
          {
            id: "launch-table",
            type: "table",
            order: 4,
            title: "Channel plan",
            columns: ["Channel", "Primary asset", "Success signal"],
            rows: [
              ["X / Twitter", "Thread + looping clip", "Replies from builders"],
              ["Indie communities", "Compact demo post", "Qualified traffic"],
              ["Direct outreach", "Personalized note", "Booked intro calls"],
            ],
          },
        ],
      },
      {
        id: "launch-v3",
        label: "Version 2",
        summary:
          "The previous draft leaned more on channel planning and less on post-launch response work.",
        updatedAtLabel: "Updated 3d ago",
        widgets: [
          {
            id: "launch-v3-table",
            type: "table",
            order: 1,
            title: "Channel plan",
            columns: ["Channel", "Asset", "Owner"],
            rows: [
              ["X / Twitter", "Thread", "Founder"],
              ["Indie communities", "Demo post", "Founder"],
              ["Email", "Personal outreach", "Ops"],
            ],
          },
          {
            id: "launch-v3-checklist",
            type: "checklist",
            order: 2,
            title: "Launch prep",
            items: [
              { id: "launch-v3-task-1", text: "Lock announcement copy", done: true },
              { id: "launch-v3-task-2", text: "Capture product demo", done: false },
              { id: "launch-v3-task-3", text: "Assemble replies doc", done: false },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "sample-content-calendar",
    slug: "content-calendar",
    title: "Content Calendar",
    summary:
      "A compact editorial workspace for keeping the weekly story cadence visible without turning the plan into a bloated project board.",
    updatedAtLabel: "Updated yesterday",
    widgets: [
      {
        id: "content-notes",
        type: "notes",
        order: 1,
        title: "Editorial rule",
        content:
          "Every post should show the before and after: raw AI text on one side, a structured PlanWiki workspace on the other. Keep examples concrete and visual.",
      },
      {
        id: "content-table",
        type: "table",
        order: 2,
        title: "Weekly lineup",
        columns: ["Day", "Format", "Hook"],
        rows: [
          ["Monday", "Short post", "Why AI plans fail at execution"],
          ["Wednesday", "Carousel", "From blob of text to widget board"],
          ["Friday", "Demo clip", "Build a workspace in under a minute"],
        ],
      },
      {
        id: "content-checklist",
        type: "checklist",
        order: 3,
        title: "Publishing routine",
        items: [
          { id: "content-task-1", text: "Write the weekly three-post arc", done: true },
          { id: "content-task-2", text: "Batch thumbnails and screenshots", done: false },
          { id: "content-task-3", text: "Queue CTA variants", done: false },
        ],
      },
      {
        id: "content-phases",
        type: "phases",
        order: 4,
        title: "Production flow",
        items: [
          {
            id: "content-phase-1",
            name: "Research",
            status: "done",
            tasks: ["Collect prompts", "Pull user questions"],
          },
          {
            id: "content-phase-2",
            name: "Build",
            status: "active",
            tasks: ["Draft posts", "Cut clip", "Review visuals"],
          },
          {
            id: "content-phase-3",
            name: "Ship",
            status: "pending",
            tasks: ["Schedule posts", "Measure saves", "Feed learnings back"],
          },
        ],
      },
    ],
    versions: [
      {
        id: "content-v2",
        label: "Version 1",
        summary:
          "The current editorial version is built around a repeatable weekly cadence with tighter production and publishing routines.",
        updatedAtLabel: "Updated yesterday",
        widgets: [
          {
            id: "content-notes",
            type: "notes",
            order: 1,
            title: "Editorial rule",
            content:
              "Every post should show the before and after: raw AI text on one side, a structured PlanWiki workspace on the other. Keep examples concrete and visual.",
          },
          {
            id: "content-table",
            type: "table",
            order: 2,
            title: "Weekly lineup",
            columns: ["Day", "Format", "Hook"],
            rows: [
              ["Monday", "Short post", "Why AI plans fail at execution"],
              ["Wednesday", "Carousel", "From blob of text to widget board"],
              ["Friday", "Demo clip", "Build a workspace in under a minute"],
            ],
          },
          {
            id: "content-checklist",
            type: "checklist",
            order: 3,
            title: "Publishing routine",
            items: [
              { id: "content-task-1", text: "Write the weekly three-post arc", done: true },
              { id: "content-task-2", text: "Batch thumbnails and screenshots", done: false },
              { id: "content-task-3", text: "Queue CTA variants", done: false },
            ],
          },
          {
            id: "content-phases",
            type: "phases",
            order: 4,
            title: "Production flow",
            items: [
              {
                id: "content-phase-1",
                name: "Research",
                status: "done",
                tasks: ["Collect prompts", "Pull user questions"],
              },
              {
                id: "content-phase-2",
                name: "Build",
                status: "active",
                tasks: ["Draft posts", "Cut clip", "Review visuals"],
              },
              {
                id: "content-phase-3",
                name: "Ship",
                status: "pending",
                tasks: ["Schedule posts", "Measure saves", "Feed learnings back"],
              },
            ],
          },
        ],
      },
      {
        id: "content-v1",
        label: "Version 2",
        summary:
          "The first pass was a lighter editorial checklist with only the lineup and a basic publishing routine.",
        updatedAtLabel: "Updated last week",
        widgets: [
          {
            id: "content-v1-table",
            type: "table",
            order: 1,
            title: "Initial lineup",
            columns: ["Slot", "Format", "Theme"],
            rows: [
              ["Post 1", "Text", "AI output problems"],
              ["Post 2", "Carousel", "Plan to widget transformation"],
              ["Post 3", "Clip", "Speed demo"],
            ],
          },
          {
            id: "content-v1-checklist",
            type: "checklist",
            order: 2,
            title: "Basic routine",
            items: [
              { id: "content-v1-task-1", text: "Draft weekly arc", done: true },
              { id: "content-v1-task-2", text: "Pick visuals", done: false },
            ],
          },
        ],
      },
    ],
  },
]

export function findSampleWorkspaceBySlug(slug: string) {
  return sampleWorkspaces.find((workspace) => workspace.slug === slug) ?? null
}
