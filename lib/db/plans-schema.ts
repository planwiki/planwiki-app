import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

export const plans = pgTable("plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title"),
  slug: text("slug").unique(),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow(),
});

export const planRelations = relations(plans, ({ one }) => ({
  user: one(user, {
    fields: [plans.userId],
    references: [user.id],
  }),
}));
