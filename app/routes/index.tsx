import { zValidator } from '@hono/zod-validator'
import { and, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { Hono } from 'hono'
import { deleteCookie, getCookie } from 'hono/cookie'
import { css } from 'hono/css'
import { createRoute } from 'honox/factory'
import { z } from 'zod'

import { styles } from './index-css'
import { todoStatusEnum, todos } from '../../db/schemas'
import Todo from '../islands/Todo'
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
  const db = { user: new userUseCase(c), todo: drizzle(c.env.DB) }
  const allTodos = await db.todo
    .select()
    .from(todos)
    .orderBy(todos.updatedAt)
    .all()
  const sessionId = getCookie(c, 'sessionId')
  const user: Res<InsertUser, [401, 400, 500]> | undefined = await userHandler(
    sessionId,
    db.user,
  )

  if (user !== undefined && user.status !== 200) {
    deleteCookie(c, 'sessionId')
    return c.redirect('/login')
  }
  return c.render(
    <div class={styles.body}>
      <h1>
        Hello!<b>{user?.body.name}</b>
      </h1>
      <a href={getUserStatus(user)}>{getUserStatus(user)}</a>
      <form method='post' class={styles.form}>
        <input name='title' />
        <input
          name='createdBy'
          value={user?.body.id}
          class={css`
            display: none;
          `}
          type='number'
        />
        <input type='submit' value={'create!'} />
      </form>
      {user && (
        <>
          <h3>private</h3>
          {allTodos
            .filter(e => e.createdBy === user?.body.id)
            .map(todo => {
              return <Todo todo={todo} />
            })}
        </>
      )}
      <h3>public</h3>
      {allTodos
        .filter(e => e.createdBy === null)
        .map(todo => {
          return <Todo todo={todo} />
        })}
    </div>,
    { title: 'TODOs' },
  )
})

const schema = z.object({
  title: z.string().min(1),
  createdBy: z.coerce.number().optional(),
})

export const POST = createRoute(zValidator('form', schema), async c => {
  const todo = c.req.valid('form')
  console.log(todo)
  const db = drizzle(c.env.DB)
  await db
    .insert(todos)
    .values({
      ...todo,
      createdBy: todo.createdBy !== undefined ? todo.createdBy : undefined,
    })
    .returning()
  return c.redirect('/')
})

const valid = zValidator(
  'json',
  z.object({
    id: z.number(),
    title: z.string(),
    status: z.enum(todoStatusEnum),
    createdBy: z.union([z.number(), z.null()]),
  }),
)

const routes = app
  .put('/', valid, async c => {
    const req = c.req.valid('json')
    const db = { user: new userUseCase(c), todo: drizzle(c.env.DB) }
    const sessionId = getCookie(c, 'sessionId')
    const user: Res<SelectUser, [500, 401, 400]> | undefined =
      sessionId !== undefined ? await db.user.fetchUser(sessionId) : undefined
    if (user !== undefined && user?.status !== 200) {
      deleteCookie(c, 'sessionId')
      return c.json(user)
    }
    const res: Res<SelectTodo> = await db.todo
      .update(todos)
      .set({ ...req, updatedAt: new Date() })
      .where(
        and(
          eq(todos.id, req.id),
          user === undefined ? undefined : eq(todos.createdBy, user.body.id),
        ),
      )
      .returning()
      .then((v): { status: 200; body: SelectTodo } => ({
        status: 200,
        body: v[0],
      }))
      .catch(
        (): {
          status: 500
        } => ({
          status: 500,
        }),
      )
    return c.json(res)
  })
  .delete('/', valid, async c => {
    const req = c.req.valid('json')
    const db = drizzle(c.env.DB)
    const res: Res<SelectTodo> = await db
      .delete(todos)
      .where(eq(todos.id, req.id))
      .returning()
      .then((v): { status: 200; body: SelectTodo } => ({
        status: 200,
        body: v[0],
      }))
      .catch(() => ({ status: 500 }))
    return c.json(res)
  })
export type AppType = typeof routes

export default app
