import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { todos } from ".";

export type SelectTodo = InferSelectModel<typeof todos>;
export type InsertTodo = InferInsertModel<typeof todos>;
