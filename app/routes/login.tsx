import { zValidator } from '@hono/zod-validator'
import { deleteCookie, setCookie } from 'hono/cookie'
import { css } from 'hono/css'
import { createRoute } from 'honox/factory'
import { z } from 'zod'
import type { SelectUser } from '../../db/schemas'
import { userUseCase } from '../useCase/userUseCase'
import type { Res } from './types'

const CustomString = z
  .string()
  .transform(value => (value === '' ? undefined : value))

const schema = z.object({
  name: CustomString.optional(),
  accountId: z.string().min(1),
  password: z.string().min(8),
})

export const GET = createRoute(c => {
  return c.render(
    <form
      class={css`
        display: grid;
        grid-template-columns: repeat(2, auto);
      `}
      method='POST'
    >
      <label for='name'>name</label>
      <input type='text' name='name' />
      <label for='accountId'>accountId</label>
      <input type='text' name='accountId' />
      <label for='password'>password</label>
      <input type='password' name='password' />
      <input
        type='submit'
        class={css`
          grid-column: 1/3;
          width: fit-content;
          margin: auto;
        `}
      />
    </form>,
  )
})

export const POST = createRoute(zValidator('form', schema), async c => {
  const user = c.req.valid('form')
  const db = new userUseCase(c)
  const res: Res<SelectUser, [400, 500]> = await db.sessionStart(user)
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
