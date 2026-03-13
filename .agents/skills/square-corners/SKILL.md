---
name: square-corners
description: Enforce PlanWiki's default UI shape language use squared edges and `rounded-none` across workspace surfaces, widgets, badges, cards, and controls unless the user explicitly asks for rounded corners.
---

Apply this skill when building or restyling PlanWiki UI.

## Core rule

- Default to `rounded-none`.
- Treat square corners as the project style for workspace pages, widgets, cards, badges, chips, stats, tables, controls, and overlays.
- Do not introduce `rounded`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full`, or pill-shaped treatments unless the user explicitly requests them.

## What to preserve

- Keep the existing flat, minimal visual language.
- Prefer borders and spacing over decorative shape styling.
- If a component comes from a shared UI primitive with rounded defaults, override it locally with `rounded-none` where it appears in PlanWiki surfaces.

## When working on existing files

- Remove accidental corner rounding from wrappers and internal elements.
- Check usage sites, not just base components. A square base component can still be overridden by `rounded-full` or similar classes in feature code.
- Keep sidebar behavior and established layout patterns intact unless the user asks for structural changes.

## Quick checklist

- Cards: square
- Widget shells: square
- Badges/chips/status pills: square
- Buttons in workspace UI: square unless existing design requires otherwise
- Inputs, textareas, tables, dropdown surfaces: square where they participate in the workspace visual system

If there is any ambiguity, choose the less-rounded option.
