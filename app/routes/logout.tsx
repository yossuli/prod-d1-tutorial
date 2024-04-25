import { deleteCookie, getCookie } from 'hono/cookie'
import { createRoute } from 'honox/factory'

import { userUseCase } from '../useCase/userUseCase'

import type { Res } from './types'
import type { SelectUser } from '../../db/schemas'

export const GET = createRoute(async c => {
  const sessionId = getCookie(c, 'sessionId')
  if (sessionId !== undefined) {
    const db = new userUseCase(c)
    const res: Res<SelectUser, [200 | 400 | 500 | 401]> =
      await db.logout(sessionId)
    if (res.status === 200) {
      deleteCookie(c, 'sessionId')
      return c.redirect('/')
    }
    if (res.status === 401) {
      deleteCookie(c, 'sessionId')
    }
    return c.render(
      <dev>
        <h1>Error Occurred!</h1>
        <a href='/'>redirect to home</a>
      </dev>,
    )
  }
})
