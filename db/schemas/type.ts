import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { users } from ".";

export type SelectTodo = InferSelectModel<typeof users>;
export type InsertTodo = InferInsertModel<typeof users>;
