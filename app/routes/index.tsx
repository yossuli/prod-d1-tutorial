import { css } from "hono/css";
import { createRoute } from "honox/factory";
import Counter from "../islands/counter";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const className = css`
  font-family: sans-serif;
`;

export default createRoute((c) => {
  const name = c.req.query("name") ?? "Hono";
  return c.render(
    <div class={className}>
      <h1>Hello, {name}!</h1>
      <Counter />
      <form method="post">
        <input name="title"></input>
        <input type="submit"></input>
      </form>
    </div>,
    { title: name }
  );
});

const schema = z.object({
  title: z.string().min(1),
});

export const POST = createRoute(zValidator("form", schema), async (c) => {
  const { title } = c.req.valid("form");
  const res = await c.env.DB.prepare(
    "INSERT INTO todo (title) VALUES (?) RETURNING *"
  )
    .bind(title)
    .run();
  return c.text(JSON.stringify(res));
});
