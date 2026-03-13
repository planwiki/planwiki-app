Here's the full blueprint — JSON contract, shadcn components, and dynamic rendering architecture.

---

## 1. The JSON Contract (LLM Output)

This is the **single source of truth**. The LLM outputs this, nothing else:

```json
{
  "title": "Act-SDK Launch Plan",
  "summary": "Ship v1, get 100 stars, land 3 design partners.",
  "widgets": [
    {
      "id": "w1",
      "type": "checklist",
      "order": 1,
      "title": "Pre-Launch Tasks",
      "items": [
        { "id": "i1", "text": "Polish README", "done": false },
        { "id": "i2", "text": "Record demo GIF", "done": true }
      ]
    },
    {
      "id": "w2",
      "type": "phases",
      "order": 2,
      "title": "Launch Timeline",
      "items": [
        {
          "id": "p1",
          "name": "Week 1 — Ship",
          "status": "done",
          "tasks": ["Publish npm", "README"]
        },
        {
          "id": "p2",
          "name": "Week 2 — Distribute",
          "status": "active",
          "tasks": ["Show HN", "Reddit"]
        },
        {
          "id": "p3",
          "name": "Week 3 — Validate",
          "status": "pending",
          "tasks": ["DM users", "Feedback calls"]
        }
      ]
    },
    {
      "id": "w3",
      "type": "table",
      "order": 3,
      "title": "Tech Stack",
      "columns": ["Layer", "Tool", "Notes"],
      "rows": [
        ["Frontend", "Next.js", "App router"],
        ["UI", "shadcn + Tailwind", "Component library"],
        ["AI", "Vercel AI SDK", "Streaming + BYOK"]
      ]
    },
    {
      "id": "w4",
      "type": "notes",
      "order": 4,
      "title": "Key Decisions",
      "content": "LLM outputs JSON only. Shadcn renders everything. ReactFlow added in v2 for architecture graphs."
    }
  ]
}
```

---

## 2. MVP shadcn Components Per Widget

**Install once, use everywhere:**

```bash
npx shadcn@latest add card checkbox progress badge separator table
```

### `checklist` widget

```
Card
 └── CardHeader → title + Progress bar (overall completion %)
 └── CardContent → Checkbox + label per item
```

shadcn used: `Card` `CardHeader` `CardContent` `Checkbox` `Progress`

---

### `phases` widget

```
Card
 └── CardHeader → title
 └── CardContent → vertical list of phases
      └── Badge (done/active/pending) + phase name + task list
      └── Separator between phases
```

shadcn used: `Card` `Badge` `Separator`

---

### `table` widget

```
Card
 └── CardHeader → title
 └── CardContent
      └── Table → TableHeader → TableRow → TableHead
               └── TableBody  → TableRow → TableCell
```

shadcn used: `Card` `Table` `TableHeader` `TableBody` `TableRow` `TableHead` `TableCell`

---

### `notes` widget

```
Card
 └── CardHeader → title
 └── CardContent → plain text or markdown
```

shadcn used: `Card` — simplest widget, just text inside

---

## 3. The Widget Registry (dynamic rendering)

This is the core engine — **one object maps every type to a component:**

```tsx
// registry.ts
import ChecklistWidget from "@/widgets/ChecklistWidget";
import PhasesWidget from "@/widgets/PhasesWidget";
import TableWidget from "@/widgets/TableWidget";
import NotesWidget from "@/widgets/NotesWidget";

export const WIDGET_REGISTRY = {
  checklist: ChecklistWidget,
  phases: PhasesWidget,
  table: TableWidget,
  notes: NotesWidget,
};
```

```tsx
// PlanRenderer.tsx
import { WIDGET_REGISTRY } from "@/registry";

export function PlanRenderer({ plan }) {
  const sorted = [...plan.widgets].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-4">
      {sorted.map((widget) => {
        const Widget = WIDGET_REGISTRY[widget.type];
        if (!Widget) return null;
        return <Widget key={widget.id} data={widget} />;
      })}
    </div>
  );
}
```

Adding a new widget in v2 is just: **build the component → add one line to the registry.** The renderer never changes.

---

## 4. The LLM System Prompt

This is what forces clean, renderable JSON every time:

```
You are a plan parser for PlanWiki.

When given any AI-generated plan or architecture text, convert it into a structured JSON workspace.

Rules:
- Return ONLY valid JSON. No markdown. No explanation. No backticks.
- Every widget must have: id, type, order, title
- Widget types available: "checklist", "phases", "table", "notes"
- Order widgets logically: overview/notes first, phases second, checklists third, tables last
- For checklist items always include: id, text, done (boolean)
- For phases always include: id, name, status ("pending"|"active"|"done"), tasks (string array)
- For tables always include: columns (string array), rows (array of string arrays)
- Keep text concise — this is UI, not prose
- Every actionable item must be a checklist item
- Never invent widget types outside the available list
```

---

## 5. Your File Structure for MVP

```
/widgets
  ChecklistWidget.tsx    ← Card + Checkbox + Progress
  PhasesWidget.tsx       ← Card + Badge + Separator
  TableWidget.tsx        ← Card + Table components
  NotesWidget.tsx        ← Card + text

/lib
  registry.ts            ← type → component map
  schema.ts              ← TypeScript types for JSON contract

/components
  PlanRenderer.tsx       ← sorts + maps widgets
  PasteInput.tsx         ← textarea → calls LLM → gets JSON
```

That's your entire MVP. Want me to now build out one of these widgets as a real shadcn component so you can see it rendered?
