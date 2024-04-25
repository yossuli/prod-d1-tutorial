import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { deleteCookie, getCookie } from 'hono/cookie'
import { css } from 'hono/css'
import { createRoute } from 'honox/factory'
import { z } from 'zod'

import { styles } from './index-css'
import { todoStatusEnum } from '../../db/schemas'
import Todo from '../islands/Todo'
import { todoUseCase } from '../useCase/todoUseCase'
import { userUseCase } from '../useCase/userUseCase'

import type { Res } from './types'
import type { InsertUser, SelectTodo, SelectUser } from '../../db/schemas'

const app = new Hono()

const userHandler = async (
  sessionId: string | undefined,
  userDB: userUseCase,
) =>
  sessionId !== undefined
    ? await userDB.fetchUser(sessionId).then(v => {
        return v
      })
    : undefined

const getUserStatus = (user: Res<InsertUser, [401, 400, 500]> | undefined) =>
  user ? 'logout' : 'login'

export const GET = createRoute(async c => {
  const db = { user: new userUseCase(c), todo: new todoUseCase(c) }
  const allTodos = await db.todo.getAllTodos()
  const sessionId = getCookie(c, 'sessionId')
  const user: Res<InsertUser, [401, 400, 500]> | undefined = await userHandler(
    sessionId,
    db.user,
  )

  if (user !== undefined && user.status !== 200) {
    deleteCookie(c, 'sessionId')
    return c.redirect('/login')
  }
  if (allTodos.status !== 200) {
    return c.render(<p>error</p>)
  }
  return c.render(
    <div class={styles.body}>
      <h1>
        Hello!<b>{user?.body.name}</b>
      </h1>
      <a href={getUserStatus(user)}>{getUserStatus(user)}</a>
      <form method='post' class={styles.form}>
        <input name='title' />
        {user && (
          <input
            name='createdBy'
            value={user.body.id}
            class={css`
              display: none;
            `}
            type='number'
          />
        )}
        <input type='submit' value={'create!'} />
      </form>

      <h3>private</h3>
      {allTodos.body
        .filter(e => e.createdBy === user?.body.id)
        .map(todo => {
          return <Todo todo={todo} />
        })}
      <h3>public</h3>

      {allTodos.body
        .filter(e => e.createdBy === null)
        .map(todo => {
          return <Todo todo={todo} />
        })}
    </div>,
    { title: 'TODOs' },
  )
})

const formValid = zValidator(
  'form',
  z.object({
    title: z.string().min(1),
    createdBy: z.coerce.number().optional(),
  }),
)

export const POST = createRoute(formValid, async c => {
  const todo = c.req.valid('form')
  console.log(todo)
  const db = new todoUseCase(c)
  await db.createTodo({ ...todo })
  return c.redirect('/')
})

const jsonValid = zValidator(
  'json',
  z.object({
    id: z.number(),
    title: z.string(),
    status: z.enum(todoStatusEnum),
    createdBy: z.union([z.number(), z.null()]),
  }),
)

const routes = app
  .put('/', jsonValid, async c => {
    const todo = c.req.valid('json')
    const db = {
      user: new userUseCase(c),
      todo: new todoUseCase(c),
    }
    const sessionId = getCookie(c, 'sessionId')
    const user: Res<SelectUser, [500, 401, 400]> | undefined =
      sessionId !== undefined ? await db.user.fetchUser(sessionId) : undefined
    if (user !== undefined && user?.status !== 200) {
      deleteCookie(c, 'sessionId')
      return c.json(user)
    }
    const res: Res<SelectTodo, [500, 200, 400]> = await db.todo.updateTodo({
      ...todo,
    })
    return c.json(res)
  })
  .delete('/', jsonValid, async c => {
    const todo = c.req.valid('json')
    const db = new todoUseCase(c)
    const res: Res<SelectTodo, [500, 400, 200]> = await db.deleteTodo({
      ...todo,
    })
    return c.json(res)
  })
export type AppType = typeof routes

export default app
