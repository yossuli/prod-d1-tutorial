import { createRoute } from "honox/factory";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import {
  InsertUser,
  SelectTodo,
  SelectUser,
  todoStatusEnum,
  todos,
  users,
} from "../../db/schemas";
import { Hono } from "hono";
import Todo from "../islands/todo";
import { and, eq, sql } from "drizzle-orm";
import { styles } from "./index-css";
import { Res } from "./types";
import { getCookie } from "hono/cookie";
import { css } from "hono/css";

const app = new Hono();

export const GET = createRoute(async (c) => {
  const db = drizzle(c.env.DB);
  const res = await db.select().from(todos).orderBy(todos.updatedAt).all();
  const sessionId = getCookie(c, "sessionId");
  const user: InsertUser | undefined =
    sessionId !== undefined
      ? await db
          .select()
          .from(users)
          .where(eq(users.sessionId, sessionId))
          .all()
          .then((v) => v[0])
          .catch(() => undefined)
      : undefined;
  return c.render(
    <div class={styles.body}>
      <h1>
        Hello!<b>{user && user.name}</b>
      </h1>
      {user || <a href="login">login</a>}
      {user && <a href="logout">logout</a>}
      <form method="post" class={styles.form}>
        <input name="title"></input>
        <input
          name="createdBy"
          value={user?.id}
          class={css`
            display: none;
          `}
          type="number"
        ></input>
        <input type="submit" value={"create!"}></input>
      </form>
      {user && (
        <>
          <h3>private</h3>
          {res
            .filter((e) => e.createdBy === user?.id)
            .map((todo) => {
              return <Todo todo={todo} />;
            })}
        </>
      )}
      <h3>public</h3>
      {res
        .filter((e) => e.createdBy === null)
        .map((todo) => {
          return <Todo todo={todo} />;
        })}
    </div>,
    { title: "TODOs" }
  );
});

const schema = z.object({
  title: z.string().min(1),
  createdBy: z.coerce.number().optional(),
});

export const POST = createRoute(zValidator("form", schema), async (c) => {
  const todo = c.req.valid("form");
  console.log(todo);
  const db = drizzle(c.env.DB);
  await db
    .insert(todos)
    .values({ ...todo, createdBy: todo.createdBy || undefined })
    .returning();
  return c.redirect("/");
});

const valid = zValidator(
  "json",
  z.object({
    id: z.number(),
    title: z.string(),
    status: z.enum(todoStatusEnum),
    createdBy: z.union([z.number(), z.null()]),
  })
);

const routes = app
  .put("/", valid, async (c) => {
    const req = c.req.valid("json");
    const db = drizzle(c.env.DB);
    const sessionId = getCookie(c, "sessionId");
    const user: Res<SelectUser> | undefined =
      sessionId === undefined || req.createdBy === null
        ? undefined
        : await db
            .select()
            .from(users)
            .where(
              and(eq(users.sessionId, sessionId), eq(users.id, req.createdBy))
            )
            .all()
            .then((v): { status: 200; body: SelectUser } => ({
              status: 200,
              body: v[0],
            }))
            .catch(() => ({
              status: 500,
            }));
    if (user?.status === 500) {
      return c.json(user);
    }
    const res = await db
      .update(todos)
      .set({ ...req, updatedAt: new Date() })
      .where(
        and(
          eq(todos.id, req.id),
          user === undefined ? undefined : eq(todos.createdBy, user.body.id)
        )
      )
      .returning()
      .then((v) => ({ status: 200, body: v[0] }))
      .catch(() => ({
        status: 500,
      }));
    return c.json(res);
  })
  .delete("/", valid, async (c) => {
    const req = c.req.valid("json");
    const db = drizzle(c.env.DB);
    const res: Res<SelectTodo> = await db
      .delete(todos)
      .where(eq(todos.id, req.id))
      .returning()
      .then((v): { status: 200; body: SelectTodo } => ({
        status: 200,
        body: v[0],
      }))
      .catch(() => ({ status: 500 }));
    return c.json(res);
  });
export type AppType = typeof routes;

export default app;
