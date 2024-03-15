import { and, eq } from 'drizzle-orm'
import type { InsertUser, SelectUser } from '../../db/schemas'
import { users } from '../../db/schemas'
import { RepositoryBase } from './_repoBase'

export class UserRepository extends RepositoryBase {
  async createUser(user: InsertUser) {
    const drizzleUser = await this.drizzle
      .insert(users)
      .values(user)
      .returning()
      .then((v): { status: 200; body: SelectUser } => ({
        status: 200,
        body: v[0],
      }))
      .catch((e): { status: 500; body: string } => ({
        status: 500,
        body: String(e),
      }))
    return drizzleUser
  }
  async updateUser(
    user: Partial<InsertUser> & Pick<InsertUser, 'accountId' | 'password'>,
  ) {
    const drizzleUser = await this.drizzle
      .update(users)
      .set(user)
      .where(
        and(
          eq(users.accountId, user.accountId),
          eq(users.password, user.password),
        ),
      )
      .returning()
      .then((v): { status: 200; body: SelectUser | undefined } => ({
        status: 200,
        body: v[0],
      }))
      .catch((e): { status: 500; body: string } => ({
        status: 500,
        body: String(e),
      }))
    return drizzleUser
  }
  async getUser(sessionId: string) {
    const drizzleUser = await this.drizzle
      .select()
      .from(users)
      .where(and(eq(users.sessionId, sessionId), eq(users.isLoggedIn, true)))
      .all()
      .then((v): { status: 200; body: SelectUser | undefined } => ({
        status: 200,
        body: v[0],
      }))
      .catch((e): { status: 500; body: string } => ({
        status: 500,
        body: String(e),
      }))
    return drizzleUser
  }
}
