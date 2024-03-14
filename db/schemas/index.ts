import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export type * from "./type";
export const todoStatusEnum: ["todo", "doing", "done"] = [
  "todo",
  "doing",
  "done",
];

export const todos = sqliteTable("todo", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  status: text("status", { enum: todoStatusEnum }).default("todo").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  createdBy: integer("createdBy"),
});

export const users = sqliteTable("user", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  accountId: text("accountId").unique().notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  sessionId: text("sessionId").unique().notNull(),
  lastLoggedInAt: integer("lastLoggedInAt", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  isLoggedIn: integer("isLoggedIn", { mode: "boolean" })
    .notNull()
    .default(true),
});
