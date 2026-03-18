---
name: square-corners
description: Enforce PlanWiki's updated UI shape language shared `components/ui` primitives default to `rounded-sm`, while composed workspace surfaces, widgets, badges, cards, and controls stay `rounded-none` unless the user explicitly asks for more rounding.
---

Apply this skill when building or restyling PlanWiki UI.

## Core rule

- Default shared primitives in `components/ui` to `rounded-sm`.
- Default composed PlanWiki surfaces outside `components/ui` to `rounded-none`.
- Treat square corners as the project style for workspace pages, widgets, cards, badges, chips, stats, tables, controls, and overlays that make up the product UI.
- Do not introduce `rounded`, `rounded-md`, `rounded-lg`, `rounded-xl`, or pill-shaped treatments unless the user explicitly requests them.

## What to preserve

- Keep the existing flat, minimal visual language.
- Prefer borders and spacing over decorative shape styling.
- Keep circular affordances that rely on `rounded-full` for their function or iconography.
- If a component comes from a shared UI primitive with `rounded-sm` defaults, override it locally with `rounded-none` where it appears in PlanWiki surfaces.

## When working on existing files

- Remove accidental corner rounding from wrappers and internal elements.
- Check usage sites, not just base components. A square feature surface can still be overridden by `rounded-md`, `rounded-lg`, or `rounded-full` in feature code.
- Keep sidebar behavior and established layout patterns intact unless the user asks for structural changes.

## Quick checklist

- `components/ui`: `rounded-sm` by default
- Cards: square at usage sites unless the user asks otherwise
- Widget shells: square
- Badges/chips/status pills: square
- Buttons in workspace UI: square unless existing design requires otherwise
- Inputs, textareas, tables, dropdown surfaces: square where they participate in the workspace visual system

If there is any ambiguity, use `rounded-sm` in `components/ui` and `rounded-none` everywhere else.
