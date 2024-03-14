import { createRoute } from "honox/factory";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { css } from "hono/css";
import { InsertUser, SelectUser, users } from "../../db/schemas";
import { nanoid } from "nanoid";
import { and, eq } from "drizzle-orm";
import { deleteCookie, setCookie } from "hono/cookie";
import { Res } from "./types";
import { userUseCase } from "../useCase/userUseCase";

const CustomString = z
  .string()
  .transform((value) => (value === "" ? undefined : value));

const schema = z.object({
  name: CustomString.optional(),
  accountId: z.string().min(1),
  password: z.string().min(8),
});

export const GET = createRoute((c) => {
  return c.render(
    <form
      class={css`
        display: grid;
        grid-template-columns: repeat(2, auto);
      `}
      method="POST"
    >
      <label for="name">name</label>
      <input type="text" name="name" />
      <label for="accountId">accountId</label>
      <input type="text" name="accountId" />
      <label for="password">password</label>
      <input type="password" name="password" />
      <input
        type="submit"
        class={css`
          grid-column: 1/3;
          width: fit-content;
          margin: auto;
        `}
      ></input>
    </form>
  );
});

export const POST = createRoute(zValidator("form", schema), async (c) => {
  const user = c.req.valid("form");
  console.log(user);
  const db = new userUseCase(c);
  const res: Res<SelectUser> = await db.sessionStart(user);
  if (res.status === 200) {
    setCookie(c, "sessionId", res.body.sessionId);
    return c.redirect("/");
  }
  deleteCookie(c, "sessionId");
  return c.render(
    <dev>
      <h1>Error Occurred!</h1>
      <a href="/login">redirect to login</a>
    </dev>
  );
});
