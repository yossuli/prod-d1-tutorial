import { createRoute } from "honox/factory";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { css } from "hono/css";
import { InsertUser, SelectUser, users } from "../../db/schemas";
import { nanoid } from "nanoid";
import { and, eq } from "drizzle-orm";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { Res } from "./types";

export const GET = createRoute(async (c) => {
  const sessionId = getCookie(c, "sessionId");
  if (sessionId !== undefined) {
    const db = drizzle(c.env.DB);
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
      .catch(() => ({ status: 500 }));
    if (res.status === 200) {
      deleteCookie(c, "sessionId");
      return c.redirect("/");
    }
  }
  return c.render(
    <dev>
      <h1>Error Occurred!</h1>
      <a href="/">redirect to home</a>
    </dev>
  );
});
