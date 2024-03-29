import { and, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { deleteCookie, getCookie } from 'hono/cookie'
import { createRoute } from 'honox/factory'

import { users } from '../../db/schemas'

import type { Res } from './types'
import type { SelectUser } from '../../db/schemas'

export const GET = createRoute(async c => {
  const sessionId = getCookie(c, 'sessionId')
  if (sessionId !== undefined) {
    const db = drizzle(c.env.DB)
    const res: Res<SelectUser> = await db
      .update(users)
      .set({
        isLoggedIn: false,
        sessionId: undefined,
      })
      .where(and(eq(users.sessionId, sessionId)))
      .returning()
      .then((v): { status: 200; body: SelectUser } => ({
        status: 200,
        body: v[0],
      }))
      .catch(() => ({ status: 500 }))
    if (res.status === 200) {
      deleteCookie(c, 'sessionId')
      return c.redirect('/')
    }
  }
  return c.render(
    <dev>
      <h1>Error Occurred!</h1>
      <a href='/'>redirect to home</a>
    </dev>,
  )
})
