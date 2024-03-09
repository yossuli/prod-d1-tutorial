import { createRoute } from "honox/factory";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { todoStatusEnum, todos } from "../../db/schemas";
import { Hono } from "hono";
import Todo from "../islands/todo";
import { eq } from "drizzle-orm";
import { styles } from "./index-css";

const app = new Hono();

const schema = z.object({
  title: z.string().min(1),
});

export const GET = createRoute(async (c) => {
  const db = drizzle(c.env.DB);
  const res = await db.select().from(todos).orderBy(todos.updatedAt).all();
  return c.render(
    <div class={styles.body}>
      <h1>TODOs</h1>
      <form method="post" class={styles.form}>
        <input name="title"></input>
        <input type="submit" value={"create!"}></input>
      </form>
      {res.map((todo) => {
        return <Todo todo={todo} />;
      })}
    </div>,
    { title: "TODOs" }
  );
});

export const POST = createRoute(zValidator("form", schema), async (c) => {
  const { title } = c.req.valid("form");
  const db = drizzle(c.env.DB);
  const res = await db.insert(todos).values({ title }).returning();
  return c.json(res);
});

const valid = zValidator(
  "json",
  z.object({
    id: z.number(),
    title: z.string(),
    status: z.enum(todoStatusEnum),
  })
);

const routes = app
  .put("/", valid, async (c) => {
    const req = c.req.valid("json");
    const db = drizzle(c.env.DB);
    const res = await db
      .update(todos)
      .set({ ...req, updatedAt: new Date() })
      .where(eq(todos.id, req.id))
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
    const res = await db
      .delete(todos)
      .where(eq(todos.id, req.id))
      .returning()
      .then((v) => ({ status: 200, body: v[0] }))
      .catch(() => ({
        status: 500,
      }));
    return c.json(res);
  });
export type AppType = typeof routes;

export default app;
