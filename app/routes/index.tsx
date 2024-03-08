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
        <input name="body"></input>
        <input type="submit"></input>
      </form>
    </div>,
    { title: name }
  );
});

const schema = z.object({
  title: z.string().min(1).max(16),
  body: z.string().min(1),
});

export const POST = createRoute(zValidator("form", schema), async (c) => {
  const { title, body } = c.req.valid("form");
  const res = await c.env.DB.prepare(
    "INSERT INTO talks (title, body) VALUES (?, ?) RETURNING *"
  )
    .bind(title, body)
    .run();
  const record = res.meta;
  return c.text(JSON.stringify(res));
  if (record) {
    return c.redirect("/talks");
  } else {
    return c.text("Failed to create note", 500);
  }
});
