import { nanoid } from "nanoid";
import { InsertUser } from "../../db/schemas";
import { UserRepository } from "../repo/userRepo";
import { Context } from "hono";

export class userUseCase {
  private readonly db;
  constructor(c: Context) {
    this.db = new UserRepository(c.env.DB);
  }

  async sessionStart(
    user: Pick<InsertUser, "password" | "accountId"> &
      Partial<Pick<InsertUser, "name">>
  ) {
    if (user.name !== undefined) {
      const res = await this.db.createUser({
        ...user,
        name: user.name,
        sessionId: nanoid(),
      });
      return res;
    }
    const res = await this.db.updateUser({
      ...user,
      lastLoggedInAt: new Date(),
      isLoggedIn: true,
      sessionId: nanoid(),
    });
    return res;
  }

  async fetchUser(sessionId: string) {
    const res = await this.db.getUser(sessionId);
    if (
      res.status === 200 &&
      res.body.lastLoggedInAt.getTime() < new Date().getTime() - 60 * 60 * 24
    ) {
      const sessionTimeout: { status: 401; body: string } = {
        status: 401,
        body: "session time out",
      };
      return sessionTimeout;
    }
    return res;
  }
}
