import { css } from "hono/css";
import { createRoute } from "honox/factory";
import Counter from "../islands/counter";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { todoStatusEnum, todos } from "../../db/schemas";
import { Hono } from "hono";
import { hc } from "hono/client";
import Todo from "../islands/todo";
import { eq } from "drizzle-orm";

const app = new Hono();

const className = css`
  font-family: sans-serif;
`;

const schema = z.object({
  title: z.string().min(1),
});

export const GET = createRoute(async (c) => {
  const name = c.req.query("name") ?? "Hono";
  const db = drizzle(c.env.DB);
  const res = (await db.select().from(todos).all()).toSorted(
    (todo) =>
      -(todo.updatedAt?.getDate() ?? todo.createdAt?.getDate() ?? Infinity)
  );
  return c.render(
    <div class={className}>
      <h1>Hello, {name}!</h1>
      <Counter />
      <form method="post">
        <input name="title"></input>
        <input type="submit"></input>
      </form>
      {res.map((todo) => {
        return <Todo todo={todo} />;
      })}
    </div>,
    { title: name }
  );
});

export const POST = createRoute(zValidator("form", schema), async (c) => {
  const { title } = c.req.valid("form");
  const db = drizzle(c.env.DB);
  const res = await db.insert(todos).values({ title }).returning();
  return c.json(res);
});

const put = app.put(
  "/",
  zValidator(
    "json",
    z.object({
      id: z.number(),
      title: z.string(),
      status: z.enum(todoStatusEnum),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
    })
  ),
  async (c) => {
    const req = c.req.valid("json");

    const db = drizzle(c.env.DB);
    const res = await db
      .update(todos)
      .set(req)
      .where(eq(todos.id, req.id))
      .returning()
      .then((result) => ({ status: 200, body: result[0] }))
      .catch(() => ({
        status: 500,
      }));
    return c.json(res);
  }
);
export type HttpPUT = typeof put;

export default app;
