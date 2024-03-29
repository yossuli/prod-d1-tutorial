import type { todos, users } from '.'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export type SelectTodo = InferSelectModel<typeof todos>
export type InsertTodo = InferInsertModel<typeof todos>

export type SelectUser = InferSelectModel<typeof users>
export type InsertUser = InferInsertModel<typeof users>
