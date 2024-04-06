import { and, eq } from 'drizzle-orm'

// import { and, eq } from "drizzle-orm";

import { RepositoryBase } from './_repoBase'
import { todos, type SelectTodo, type InsertTodo } from '../../db/schemas'

export class TodoRepository extends RepositoryBase {
  async createTodo(todo: InsertTodo) {
    const drizzleTodo = await this.drizzle
      .insert(todos)
      .values(todo)
      .returning()
      .then((v): { status: 200; body: SelectTodo } => ({
        status: 200,
        body: v[0],
      }))
      .catch((e): { status: 500; body: string } => ({
        status: 500,
        body: String(e),
      }))
    return drizzleTodo
  }

  async updateTodo(
    todo: Partial<InsertTodo> & Required<Pick<InsertTodo, 'id'>>,
  ) {
    const drizzleTodo = await this.drizzle
      .update(todos)
      .set(todo)
      .where(eq(todos.id, todo.id))
      .returning()
      .then((v): { status: 200; body: SelectTodo | undefined } => ({
        status: 200,
        body: v[0],
      }))
      .catch((e): { status: 500; body: string } => ({
        status: 500,
        body: String(e),
      }))
    return drizzleTodo
  }

  async getTodo(id: number) {
    const drizzleTodo = await this.drizzle
      .select()
      .from(todos)
      .where(eq(todos.id, id))
      .all()
      .then((v): { status: 200; body: SelectTodo | undefined } => ({
        status: 200,
        body: v[0],
      }))
      .catch((e): { status: 500; body: string } => ({
        status: 500,
        body: String(e),
      }))
    return drizzleTodo
  }

  async getAllTodos() {
    const drizzleTodo = await this.drizzle
      .select()
      .from(todos)
      .all()
      .then((v): { status: 200; body: SelectTodo[] } => ({
        status: 200,
        body: v,
      }))
      .catch((e): { status: 500; body: string } => ({
        status: 500,
        body: String(e),
      }))
    return drizzleTodo
  }
  async deleteTodo(id: number) {
    const drizzleTodo = await this.drizzle
      .delete(todos)
      .where(eq(todos.id, id))
      .returning()
      .then((v): { status: 200; body: SelectTodo } => ({
        status: 200,
        body: v[0],
      }))
      .catch((e): { status: 500; body: string } => ({
        status: 500,
        body: String(e),
      }))
    return drizzleTodo
  }
  async deleteTodosByStatus(status: SelectTodo['status'], createdBy: number) {
    const drizzleTodo = await this.drizzle
      .delete(todos)
      .where(and(eq(todos.status, status), eq(todos.createdBy, createdBy)))
      .returning()
      .then((v): { status: 200; body: SelectTodo[] } => ({
        status: 200,
        body: v,
      }))
      .catch((e): { status: 500; body: string } => ({
        status: 500,
        body: String(e),
      }))
    return drizzleTodo
  }
}
