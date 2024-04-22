import { TodoRepository } from '../repo/todoRepo'
import { handleUndefinedBody } from '../utils/handleUndefinedBody'

import type { InsertTodo, SelectTodo } from '../../db/schemas'
import type { Context } from 'hono'

export class todoUseCase {
  private readonly db
  constructor(c: Context) {
    this.db = new TodoRepository(c.env.DB)
  }
  async createTodo(todo: Pick<InsertTodo, 'title' | 'createdBy'>) {
    const res = await this.db
      .createTodo({
        ...todo,
      })
      .then(handleUndefinedBody)
    return res
  }
  async updateTodo(
    todo: Pick<SelectTodo, 'id' | 'title' | 'status' | 'createdBy'>,
  ) {
    const res = await this.db
      .updateTodo({
        ...todo,
        updatedAt: new Date(),
      })
      .then(handleUndefinedBody)
    return res
  }

  async deleteTodo(todo: Pick<SelectTodo, 'id'>) {
    const res = await this.db.deleteTodo(todo.id).then(handleUndefinedBody)

    return res
  }

  async getAllTodos() {
    const res = await this.db.getAllTodos()
    return res
  }
}
