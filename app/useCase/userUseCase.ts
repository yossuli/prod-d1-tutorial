import { nanoid } from 'nanoid'

import { UserRepository } from '../repo/userRepo'
import { handleUndefinedBody } from '../utils/handleUndefinedBody'

import type { InsertUser } from '../../db/schemas'
import type { Context } from 'hono'

export class userUseCase {
  private readonly db
  constructor(c: Context) {
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

  async logout(sessionId: string) {
    const user = await this.db.getUser(sessionId).then(handleUndefinedBody)
    if (user.status !== 200) {
      const userCannotFInd: { status: 401; body?: string } = {
        ...user,
        status: 401,
      }
      return userCannotFInd
    }
    const res = await this.db
      .updateUser({
        ...user.body,
        isLoggedIn: false,
        sessionId: undefined,
      })
      .then(handleUndefinedBody)
    return res
  }
}
