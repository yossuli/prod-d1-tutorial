import { zValidator } from '@hono/zod-validator'
import { deleteCookie, setCookie } from 'hono/cookie'
import { createRoute } from 'honox/factory'
import { z } from 'zod'

import Login from '../islands/Login'
import { userUseCase } from '../useCase/userUseCase'

const schema = z.object({
  name: z.string().min(1).optional(),
  accountId: z.string().min(1),
  password: z.string().min(8),
})

export const GET = createRoute(c => {
  return c.render(<Login />, { title: 'login/signIn form' })
})

export const POST = createRoute(zValidator('form', schema), async c => {
  const user = c.req.valid('form')
  const db = new userUseCase(c)
  const res = await db.sessionStart(user)
  if (res.status === 200) {
    setCookie(c, 'sessionId', res.body.sessionId)
    return c.redirect('/')
  }
  deleteCookie(c, 'sessionId')
  return c.render(
    <dev>
      <h1>Error Occurred!</h1>
      <a href='/login'>redirect to login</a>
    </dev>,
    { title: 'Error Occurred!' },
  )
})
