import type { Context } from 'hono'
import { nanoid } from 'nanoid'
import type { InsertUser, SelectUser } from '../../db/schemas'
import { UserRepository } from '../repo/userRepo'
import type { Res } from '../routes/types'

const handleUndefinedBody = (
  res: Res<SelectUser | undefined>,
): Res<SelectUser, [400, 500]> => {
  if (res.status === 200) {
    if (res.body === undefined) {
      const notFound: { status: 400; body: string } = {
        status: 400,
        body: 'No user found for your req',
      }
      return notFound
    }
    return { ...res, body: res.body }
  }
  return res
}

export class userUseCase {
  private readonly db
  constructor(c: Context) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    this.db = new UserRepository(c.env.DB)
  }

  async sessionStart(
    user: Pick<InsertUser, 'password' | 'accountId'> &
      Partial<Pick<InsertUser, 'name'>>,
  ) {
    if (user.name !== undefined) {
      const res = await this.db.createUser({
        ...user,
        name: user.name,
        sessionId: nanoid(),
      })
      return res
    }

    const res = await this.db
      .updateUser({
        ...user,
        lastLoggedInAt: new Date(),
        isLoggedIn: true,
        sessionId: nanoid(),
      })
      .then(handleUndefinedBody)
    return res
  }

  async fetchUser(sessionId: string) {
    const res = await this.db.getUser(sessionId).then(handleUndefinedBody)
    if (
      res.status === 200 &&
      res.body.lastLoggedInAt.getTime() < new Date().getTime() - 60 * 60 * 24
    ) {
      const sessionTimeout: { status: 401; body: string } = {
        status: 401,
        body: 'session time out',
      }
      return sessionTimeout
    }
    return res
  }
}
